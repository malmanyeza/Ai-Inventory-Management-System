import { createContext, useContext, useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useApp } from './AppContext';

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const { setLoading, setError } = useApp();
  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: "Mazoe Orange Crush",
      pricePerCase: 120.00,
      unitsPerCase: 12,
      volume: "2L",
      category: "Juices",
      barcode: "626400101001",
      supplierId: 1
    },
    {
      id: 2,
      name: "Coca Cola",
      pricePerCase: 144.00,
      unitsPerCase: 24,
      volume: "500ml",
      category: "Carbonated Drinks",
      barcode: "544900005019",
      supplierId: 2
    },
    {
      id: 3,
      name: "Sprite",
      pricePerCase: 132.00,
      unitsPerCase: 24,
      volume: "500ml",
      category: "Carbonated Drinks",
      barcode: "544900013348",
      supplierId: 2
    },
    {
      id: 4,
      name: "Mazoe Raspberry",
      pricePerCase: 125.00,
      unitsPerCase: 12,
      volume: "2L",
      category: "Juices",
      barcode: "626400101002",
      supplierId: 1
    },
    {
      id: 5,
      name: "Mineral Water",
      pricePerCase: 80.00,
      unitsPerCase: 24,
      volume: "750ml",
      category: "Water",
      barcode: "692880001124",
      supplierId: 3
    },
    {
      id: 6,
      name: "Pepsi",
      pricePerCase: 140.00,
      unitsPerCase: 24,
      volume: "500ml",
      category: "Carbonated Drinks",
      barcode: "012000125153",
      supplierId: 4
    }
  ]);

  // useEffect(() => {
  //   fetchInventory();
  // }, []);

  // // Fetch all inventory items from Firestore
  // const fetchInventory = async () => {
  //   try {
  //     setLoading(true);
  //     const querySnapshot = await getDocs(collection(db, 'inventory'));
  //     const items = querySnapshot.docs.map(doc => ({
  //       id: doc.id,
  //       ...doc.data()
  //     }));
  //     setInventory(items);
  //   } catch (error) {
  //     setError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Add a new product to Firestore
  const addProduct = async (productData) => {
    try {
      setLoading(true);
      const docRef = await addDoc(collection(db, 'inventory'), productData);
      setInventory(prev => [...prev, { id: docRef.id, ...productData }]);
      return docRef.id;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update an existing product in Firestore
  const updateProduct = async (productId, updatedData) => {
    try {
      setLoading(true);
      await updateDoc(doc(db, 'inventory', productId), updatedData);
      setInventory(prev => 
        prev.map(item => item.id === productId ? { ...item, ...updatedData } : item)
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <InventoryContext.Provider value={{ inventory, addProduct, updateProduct }}>
      {children}
    </InventoryContext.Provider>
  );
}

export const useInventory = () => useContext(InventoryContext);
