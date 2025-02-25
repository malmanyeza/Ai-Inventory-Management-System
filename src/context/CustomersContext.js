// context/CustomersContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useApp } from './AppContext';

const CustomersContext = createContext();

export function CustomersProvider({ children }) {
  const { setLoading, setError } = useApp();
  // Sample company details
  const [companyDetails] = useState({
    name: "Mazoe Holdings",
    email: "sales@mazoe.co.zw",
    address: "123 Enterprise Rd, Harare",
    phone: "+263 242 123 456",
    tin: "1234-5678-90",
    vat: "VAT123456",
    salesPerson: "John Doe"
  });
  const [customers, setCustomers] = useState([
      {
        id: 1,
        name: "OK Zimbabwe Ltd",
        type: "Supermarket",
        tin: "1012-3845-901",
        vatNumber: "VATZW001",
        contact: "+263 77 123 4567",
        email: "procurement@okzim.co.zw",
        address: "Cnr 1st Street & Nelson Mandela Ave, Harare",
        paymentTerms: "Net 30 Days"
      },
      {
        id: 2,
        name: "Pick n Pay Zimbabwe",
        type: "Supermarket",
        tin: "2015-6729-012",
        vatNumber: "VATZW002",
        contact: "+263 77 234 5678",
        email: "orders@pnp.co.zw",
        address: "Eastgate Mall, Cnr Robert Mugabe Rd & 2nd St, Harare",
        paymentTerms: "COD"
      },
      {
        id: 3,
        name: "SPAR Highlands",
        type: "Supermarket",
        tin: "3018-5634-123",
        vatNumber: "VATZW003",
        contact: "+263 77 345 6789",
        email: "highlands@spar.co.zw",
        address: "90 Harare Drive, Highlands, Harare",
        paymentTerms: "Net 15 Days"
      },
      {
        id: 4,
        name: "TM Supermarket Pvt Ltd",
        type: "Supermarket",
        tin: "4021-8945-234",
        vatNumber: "VATZW004",
        contact: "+263 77 456 7890",
        email: "purchasing@tmsuper.co.zw",
        address: "Westgate Shopping Mall, Harare",
        paymentTerms: "Net 45 Days"
      },
      {
        id: 5,
        name: "Choppies Enterprises Zimbabwe",
        type: "Supermarket",
        tin: "5024-1278-345",
        vatNumber: "VATZW005",
        contact: "+263 77 567 8901",
        email: "zimorders@choppies.co.bw",
        address: "Bulawayo Road, Chitungwiza",
        paymentTerms: "Net 60 Days"
      },
      {
        id: 6,
        name: "Food World Wholesalers",
        type: "Wholesaler",
        tin: "6027-4590-456",
        vatNumber: "VATZW006",
        contact: "+263 77 678 9012",
        email: "sales@foodworld.co.zw",
        address: "39 Arcturus Road, Graniteside, Harare",
        paymentTerms: "50% Advance"
      },
      {
        id: 7,
        name: "Green Valley Farms",
        type: "Agriculture",
        tin: "7030-7823-567",
        vatNumber: "VATZW007",
        contact: "+263 77 789 0123",
        email: "store@greenvalley.co.zw",
        address: "Plot 45, Mazowe Citrus Estate",
        paymentTerms: "Net 30 Days"
      },
      {
        id: 8,
        name: "Harare Hospitality Group",
        type: "Hospitality",
        tin: "8033-6156-678",
        vatNumber: "VATZW008",
        contact: "+263 77 890 1234",
        email: "procurement@hhg.co.zw",
        address: "7 Borrowdale Road, Borrowdale",
        paymentTerms: "Net 14 Days"
      },
      {
        id: 9,
        name: "ZimPlaza Hotel",
        type: "Hospitality",
        tin: "9036-2489-789",
        vatNumber: "VATZW009",
        contact: "+263 77 901 2345",
        email: "store@zimplaza.co.zw",
        address: "Cnr Samora Machel Ave & 3rd Street, Harare",
        paymentTerms: "COD"
      },
      {
        id: 10,
        name: "Midlands General Dealer",
        type: "Retail",
        tin: "10039-5721-890",
        vatNumber: "VATZW010",
        contact: "+263 77 012 3456",
        email: "midlandsgd@gmail.com",
        address: "78 Kwekwe Street, Gweru",
        paymentTerms: "Net 7 Days"
      }
  ]);


  // useEffect(() => {
  //   fetchCustomers();
  // }, []);

  // const fetchCustomers = async () => {
  //   try {
  //     setLoading(true);
  //     const querySnapshot = await getDocs(collection(db, 'customers'));
  //     const customersData = querySnapshot.docs.map(doc => ({
  //       id: doc.id,
  //       ...doc.data()
  //     }));
  //     setCustomers(customersData);
  //   } catch (error) {
  //     setError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const addCustomer = async (customerData) => {
    try {
      setLoading(true);
      const docRef = await addDoc(collection(db, 'customers'), customerData);
      const newCustomer = { id: docRef.id, ...customerData };
      setCustomers(prev => [...prev, newCustomer]);
      return newCustomer;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomersContext.Provider value={{ customers, addCustomer, companyDetails }}>
      {children}
    </CustomersContext.Provider>
  );
}

export const useCustomers = () => useContext(CustomersContext);