// context/OrdersContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useApp } from './AppContext';
import OpenAI from 'openai';
import { useCustomers } from './CustomersContext';
import { useInventory } from './InventoryContext';
import { extract } from 'fuzzball';
import { jsPDF } from "jspdf";
import "jspdf-autotable";


const OrdersContext = createContext();

export function OrdersProvider({ children }) {
  const { setLoading, setError } = useApp();
  const [orders, setOrders] = useState([]);
  const [assistantMessages, setAssistantMessages] = useState([]);
  const [assistantThread, setAssistantThread] = useState(null);
  const [isAssistantProcessing, setIsAssistantProcessing] = useState(false);
  const { customers, companyDetails } = useCustomers();
  const { inventory } = useInventory();
  console.log("Customers in OrdersContext:", customers);
  
  const products = inventory;

  const VAT_RATE = 0.1304;


  // Helper function to find the closest match
  const findClosestMatch = (input, options, threshold = 80) => {
    const matches = extract(input, options, {
      limit: 1, // Return only the best match
      cutoff: threshold // Minimum similarity score (0-100)
    });

    if (matches.length > 0 && matches[0][1] >= threshold) {
      return matches[0][0]; // Return the matched string
    }
    return null; // No close match found
  };


  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: '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',
    dangerouslyAllowBrowser: true
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async (orderData) => {
    try {
      setLoading(true);
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      setOrders(prev => [...prev, { id: docRef.id, ...orderData }]);
      return docRef.id;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateInvoicePDF = (orderInfo) => {
    if (!orderInfo) {
        console.error("❌ Error: Order information is missing");
        return;
    }

    console.log("🔍 Debugging orderInfo:", orderInfo);

    const {
        date,
        companyDetails = {},
        customer = {},
        items = [],
        subtotalExcl = 0,
        vatTotal = 0,
        invoiceTotal = 0,
    } = orderInfo;

    // Ensure date is a string
    const formattedDate = date ? new Date(date).toLocaleDateString() : "N/A";

    // Ensure company details are strings
    const companyInfo = String(companyDetails?.name || "Company Name");
    const companyAddress = String(companyDetails?.address || "N/A");
    const companyPhone = String(companyDetails?.phone || "N/A");
    const companyEmail = String(companyDetails?.email || "N/A");
    const companyTIN = String(companyDetails?.tin || "N/A");
    const companyVAT = String(companyDetails?.vat || "N/A");

    // Ensure customer details are strings
    const customerName = String(customer?.name || "N/A");
    const customerAddress = String(customer?.address || "N/A");
    const customerVat = String(customer?.vat || "N/A");
    const customerTin = String(customer?.tin || "N/A");
    const customerTel = String(customer?.contact || "N/A");

    // Ensure financial values are formatted numbers
    const subtotalFormatted = Number(subtotalExcl).toFixed(2);
    const vatFormatted = Number(vatTotal).toFixed(2);
    const totalFormatted = Number(invoiceTotal).toFixed(2);

    console.log("✅ Debugging Values Before PDF Generation:");
    console.log({ formattedDate, companyInfo, companyAddress, companyPhone, companyEmail, companyTIN, companyVAT });
    console.log({ customerName, customerAddress, customerTel, customerTin, customerVat });
    console.log({ subtotalFormatted, vatFormatted, totalFormatted });

    // Initialize PDF
    const doc = new jsPDF();

     const primaryColor = "#2c3e50";  // Dark blue
     const accentColor = "#e74c3c";   // Red
     const lightGrey = "#f8f9fa";
 
     try {
         // Add header with logo
         doc.setFillColor(primaryColor);
         doc.rect(0, 0, 220, 30, 'F');
         
         doc.setFontSize(22);
         doc.setTextColor("#ffffff");
         doc.setFont("helvetica", "bold");
         doc.text("SIMBI ALLOY", 15, 20);
         
         // Invoice title and details
         doc.setFontSize(14);
         doc.text("INVOICE", 180, 15, { align: "right" });
         doc.setFontSize(10);
         doc.text(`Date: ${formattedDate}`, 180, 22, { align: "right" });
 
         // Reset text settings
         doc.setTextColor(primaryColor);
         doc.setFont("helvetica", "normal");
 
         // Company/Customer columns
         const startY = 40;
         
         // Company Details
         doc.setFontSize(11);
         doc.setFont(undefined, "bold");
         doc.text("From:", 15, startY);
         doc.setFont(undefined, "normal");
         doc.text(companyInfo, 15, startY + 5);
         doc.text(companyAddress, 15, startY + 10);
         doc.text(`TIN: ${companyTIN}`, 15, startY + 15);
         doc.text(`VAT: ${companyVAT}`, 15, startY + 20);
 
         // Customer Details
         doc.setFont(undefined, "bold");
         doc.text("Bill To:", 120, startY);
         doc.setFont(undefined, "normal");
         doc.text(customerName, 120, startY + 5);
         doc.text(customerAddress, 120, startY + 10);
         doc.text(`TIN: ${customerTin}`, 120, startY + 15);
         doc.text(`VAT: ${customerVat}`, 120, startY + 20);
 
         // Divider line
         doc.setDrawColor(primaryColor);
         doc.line(15, startY + 25, 200, startY + 25);
 
         // Table data processing
         const tableData = items.map((item) => [
             item.name || "N/A",
             item.quantity || 0,
             `$${Number(item.pricePerCase || 0).toFixed(2)}`,
             `$${Number(item.unitPrice || 0).toFixed(2)}`,
             `$${Number(item.totalExcl || 0).toFixed(2)}`,
             `$${Number(item.vatAmount || 0).toFixed(2)}`,
             `$${Number(item.totalIncl || 0).toFixed(2)}`
         ]);
 
         // Generate table
         doc.autoTable({
             startY: startY + 30,
             head: [["Product", "Qty", "Price/Case", "Unit Price", "Total Excl.", "VAT", "Total Incl."]],
             body: tableData,
             theme: "striped",
             headStyles: {
                 fillColor: primaryColor,
                 textColor: "#ffffff",
                 fontSize: 10,
                 cellPadding: 3
             },
             bodyStyles: {
                 cellPadding: 2,
                 fontSize: 9
             },
             columnStyles: {
                 0: { cellWidth: 40 },
                 1: { cellWidth: 15 },
                 2: { cellWidth: 25, halign: 'right' },
                 3: { cellWidth: 25, halign: 'right' },
                 4: { cellWidth: 25, halign: 'right' },
                 5: { cellWidth: 25, halign: 'right' },
                 6: { cellWidth: 25, halign: 'right' }
             }
         });
 
         
          // Totals section
  let finalY = doc.lastAutoTable.finalY + 30; // Increased space from table
  const totalsLeft = 135; // Align all totals to the right
  const lineSpacing = 7; // Consistent vertical spacing


  // Total lines with aligned values
  doc.setFontSize(12);
  doc.setTextColor(primaryColor);

  // Subtotal
  doc.text("Subtotal (Excl. VAT):", totalsLeft, finalY);
  doc.text(`$${subtotalFormatted}`, totalsLeft + 60, finalY , { align: "right" });

  // VAT Total
  doc.text("VAT Total:", totalsLeft, finalY + lineSpacing);
  doc.text(`$${vatFormatted}`, totalsLeft + 60, finalY + lineSpacing, { align: "right" });

  // Invoice Total
  doc.setFont(undefined, "bold");
  doc.text("Invoice Total:", totalsLeft, finalY + (lineSpacing * 2));
  doc.text(`$${totalFormatted}`, totalsLeft + 60, finalY + (lineSpacing * 2), { align: "right" });

// Reset font settings for footer
doc.setFontSize(10);
doc.setTextColor(primaryColor);
doc.setFont(undefined, "normal");
 
         // Footer
         doc.setFontSize(10);
         doc.setTextColor(primaryColor);
         doc.text("Thank you for your business!", 105, 280, { align: "center" });
         doc.text("Simbi Alloy | +254 712 345 678 | info@simbialloy.com", 105, 285, { align: "center" });
 
         // Save PDF
         doc.save(`Invoice_${formattedDate.replace(/\//g, "-")}.pdf`);
     } catch (error) {
         console.error("❌ PDF Generation Error:", error);
     }
 
};

  const createInvoiceWithAssistant = async (userMessage) => {
    
    // Create dynamic instructions
    const assistantInstructions = `
      You are an invoice assistant. Follow these rules:
      1. When users mention customers/products, use fuzzy matching to find the closest match:
        - Customers: ${customers.map(c => c.name).join(', ')}
        - Products: ${products.map(p => `${p.name} ($${p.pricePerCase}/case)`).join(', ')}

      2. If the match isn't exact, ask the user for confirmation:
        - Example: "Did you mean 'OK Zimbabwe Ltd' instead of 'OK Zimbabwe'?"

      3. Handle typos and partial matches intelligently:
        - "fod lovers" → "Food Lovers"
        - "orange crush" → "Mazoe Orange Crush"

      4. Always return JSON with:
        - customerName (fuzzy matched)
        - items with productName (fuzzy matched) and quantity
        - date (YYYY-MM-DD)

      5. When providing the final response to the user:
        - Mention the customer name and the total invoice amount.
        - Inform the user that they can check the invoice from the "Downloads" folder on their machine.
        - Keep the response concise and user-friendly.

      Example final response:
      "Invoice for OK Zimbabwe Ltd has been created with a total amount of $1,198.08. You can check the invoice from the 'Downloads' folder on your machine."

      User message: "${userMessage}"
    `;


    setIsAssistantProcessing(true);
    try {
      

      // Create assistant once (store the ID in environment variables)
      let assistantId = 'asst_T7pGAOzItpvTJgex6kKXaAGV'


      if (!assistantId) {
        const assistant = await openai.beta.assistants.create({
          name: "Invoice Assistant",
          instructions: assistantInstructions,
          tools: [{
            type: "function",
            function: {
              name: "finalize_invoice",
              description: "Finalizes the invoice with complete data",
              strict: true,
              parameters: {
                type: "object",
                properties: {
                  customerName: { 
                    type: "string",  // Changed from string to number
                    description: `Must match one of: ${customers.map(c => c.name).join(', ')}`
                  },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        productName: { 
                          type: "string",
                          description: `Must match one of: ${products.map(p => p.name).join(', ')}`
                        },
                        quantity: { type: "number" }
                      },
                      additionalProperties: false,
                      required: ["productName", "quantity"]  // Fixed required fields
                    }
                  },
                  date: { 
                    type: "string",
                    description: "Date in ISO 8601 format (YYYY-MM-DD)"
                  }
                },
                additionalProperties: false,
                required: ["customerName", "items", "date"]  // Fixed required fields
              }
            }
          }],
          model: "gpt-4o"
        });
        assistantId = assistant.id;
        console.log("New assistant created:", assistantId);
      }


      // Create or continue thread
      let threadId = 'thread_JWClDt1T9IiHHA9yoA67a7Fq';
      if (!threadId) {
        const thread = await openai.beta.threads.create();
        console.log("New thread created:", thread.id);
        setAssistantThread(thread);
      }

      // Add user message to thread
      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: userMessage
      });

      let run = await openai.beta.threads.runs.createAndPoll(threadId, {
        assistant_id: assistantId,
        tools: [{
          type: "function",
          function: {
            name: "finalize_invoice",
            strict: true,
            description: "Finalizes the invoice with complete data",
            // Update your function parameters schema in BOTH places (assistant creation and run tools):
            parameters: {
              type: "object",
              properties: {
                customerName: { 
                  type: "string",
                  description: `Must match one of: ${customers.map(c => c.name).join(', ')}`
                },
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      productName: { 
                        type: "string",
                        description: `Must match one of: ${products.map(p => p.name).join(', ')}`
                      },
                      quantity: { type: "number" }
                    },
                    additionalProperties: false,
                    required: ["productName", "quantity"]
                  }
                },
                date: { 
                  type: "string",
                  description: "Date in ISO 8601 format (YYYY-MM-DD)"
                }
              },
              additionalProperties: false,
              required: ["customerName", "items", "date"]
            }
          }
        }]
      });

      

      // Handle function calling
      if (run.status === 'requires_action') {
        const toolOutputs = run.required_action.submit_tool_outputs.tool_calls.map((toolCall) => {
          if (toolCall.function.name === 'finalize_invoice') {
            let rawData;
            
            try {
              // Parse and validate input
              rawData = JSON.parse(toolCall.function.arguments);
              console.log('Here are the customers that we have', customers);
              
              // Fuzzy match customer name
              const customerNames = customers.map(c => c.name);
              const matchedCustomerName = findClosestMatch(rawData.customerName, customerNames);
              
              if (!matchedCustomerName) {
                throw new Error(`No close match found for customer "${rawData.customerName}". Valid customers: ${customerNames.join(', ')}`);
              }
      
              // Confirm the match with the user
              if (matchedCustomerName.toLowerCase() !== rawData.customerName.toLowerCase()) {
                return {
                  tool_call_id: toolCall.id,
                  output: JSON.stringify({
                    confirmationRequired: true,
                    message: `Did you mean "${matchedCustomerName}" instead of "${rawData.customerName}"? Please confirm.`
                  })
                };
              }
      
              // Find the matched customer
              const customer = customers.find(c => c.name === matchedCustomerName);
      
              // Fuzzy match product names
              const productNames = products.map(p => p.name);
              const items = rawData.items.map(item => {
                const matchedProductName = findClosestMatch(item.productName, productNames);
                
                if (!matchedProductName) {
                  throw new Error(`No close match found for product "${item.productName}". Valid products: ${productNames.join(', ')}`);
                }
      
                // Confirm the match with the user
                if (matchedProductName.toLowerCase() !== item.productName.toLowerCase()) {
                  return {
                    tool_call_id: toolCall.id,
                    output: JSON.stringify({
                      confirmationRequired: true,
                      message: `Did you mean "${matchedProductName}" instead of "${item.productName}"? Please confirm.`
                    })
                  };
                }
      
                // Find the matched product
                const product = products.find(p => p.name === matchedProductName);
      
                // Calculate pricing fields
                const unitPrice = parseFloat((product.pricePerCase / (1 + VAT_RATE)).toFixed(2));
                const totalExcl = parseFloat((unitPrice * item.quantity).toFixed(2));
                const vatAmount = parseFloat((totalExcl * VAT_RATE).toFixed(2));
                const totalIncl = parseFloat((totalExcl + vatAmount).toFixed(2));
      
                return {
                  productId: product.id,
                  name: product.name,
                  pricePerCase: product.pricePerCase,
                  quantity: item.quantity,
                  unitsPerCase: product.unitsPerCase,
                  volume: product.volume,
                  unitPrice, // Add unitPrice
                  totalExcl, // Add totalExcl
                  vatAmount, // Add vatAmount
                  totalIncl  // Add totalIncl
                };
              });
      
              // Calculate totals
              const subtotalExcl = items.reduce((sum, item) => 
                sum + (item.pricePerCase / (1 + VAT_RATE)) * item.quantity, 0);
              const vatTotal = subtotalExcl * VAT_RATE;
              const invoiceTotal = subtotalExcl + vatTotal;
      
              // Build final data
              const fullInvoiceData = {
                date: rawData.date,
                companyDetails,
                customer: {
                  id: customer.id,
                  name: customer.name,
                  tin: customer.tin,
                  vat: customer.vatNumber,
                  address: customer.address,
                  contact: customer.contact
                },
                items,
                subtotalExcl: parseFloat(subtotalExcl.toFixed(2)),
                vatTotal: parseFloat(vatTotal.toFixed(2)),
                invoiceTotal: parseFloat(invoiceTotal.toFixed(2))
              };
      
              return {
                tool_call_id: toolCall.id,
                output: JSON.stringify(fullInvoiceData)
              };
      
            } catch (error) {
              // Handle different error cases
              if (!rawData) {
                return {
                  tool_call_id: toolCall.id,
                  output: JSON.stringify({
                    error: true,
                    message: `Failed to parse function arguments: ${error.message}`,
                    receivedInput: toolCall.function.arguments
                  })
                };
              }
              
              return {
                tool_call_id: toolCall.id,
                output: JSON.stringify({
                  error: true,
                  message: error.message,
                  receivedNames: {
                    customerName: rawData.customerName,
                    productNames: rawData.items?.map(i => i.productName)
                  }
                })
              };
            }
          }
        });
      
        // Submit tool outputs
        run = await openai.beta.threads.runs.submitToolOutputsAndPoll(
          threadId,
          run.id,
          { tool_outputs: toolOutputs }
        );
      
        // Process the final invoice
        if (toolOutputs.length > 0) {
          try {
            const result = JSON.parse(toolOutputs[0].output);
            
            if (result.confirmationRequired) {
              // Ask the user for confirmation
              setAssistantMessages(prev => [...prev, { role: 'assistant', content: result.message }]);
              return;
            }
      
            if (result.error) {
              console.error("Assistant error:", result.message);
              setError(result.message);
            } else {
              generateInvoicePDF(result);
              // const orderId = await addOrder(result);
              // const orderDataWithId = { ...result, orderId };
              
            }
          } catch (parseError) {
            console.error("Failed to parse response:", parseError);
            setError("Invalid response format from assistant");
          }
        }
      }

    // Get final messages
    const messages = await openai.beta.threads.messages.list(threadId);
    const orderedMessages = messages.data.reverse();
    setAssistantMessages(orderedMessages);

    // Handle any final assistant response
    const lastMessage = orderedMessages.find(m => m.role === 'assistant');
    if (lastMessage) {
      // Display assistant response to user
      console.log("Assistant response:", lastMessage.content[0].text.value);
    }

    } catch (error) {
      setError(error.message);
      console.error("Assistant error:", error);
    } finally {
      setIsAssistantProcessing(false);
    }
  };

 

  

  return (
    <OrdersContext.Provider value={{ 
      orders, 
      addOrder,
      assistantMessages,
      createInvoiceWithAssistant,
      isAssistantProcessing,
      generateInvoicePDF,
      setAssistantMessages
    }}>
      {children}
    </OrdersContext.Provider>
  );
}

export const useOrders = () => useContext(OrdersContext);