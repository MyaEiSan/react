import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { db } from '../firebase';
import { ref } from 'firebase/storage';

export default function useFirestore() {
    let [error, setError] = useState('');
    let [loading, setLoading] = useState(false);

    let getCollection = (colName, _q,search) => {

        let qRef = useRef(_q).current 
        let [error, setError] = useState('');
        let [data, setData] = useState([]);
        let [loading, setLoading] = useState(false);

        useEffect(function () {
            setLoading(true);
            let ref = collection(db, colName);
            let quries = [];
            if (qRef) {
                quries.push(where(...qRef))
            }
            quries.push(orderBy('date', 'desc'))
            let q = query(ref,...quries);

            // getDocs(q).then(docs => {
            //   if (docs.empty) {
            //     setError('no documents found');
            //     setLoading(false);

            //   } else {
            //     let books = [];
            //     docs.forEach(doc => {
            //       let book = { id: doc.id, ...doc.data() };
            //       books.push(book)
            //     })
            //     setData(books);
            //     setLoading(false);
            //     setError('');
            //   }
            
            // })
            
            onSnapshot(q, docs => {
              if (docs.empty) {
                setError('no documents found');
                  setLoading(false);
                  setData([]);
        
              } else {
                let collectionDatas = [];
                docs.forEach(doc => {
                  let document = { id: doc.id, ...doc.data() };
                  collectionDatas.push(document)
                })
                  
                  if (search?.field && search?.value) {
                      let searchedDatas = collectionDatas.filter(doc => {
                          return doc[search?.field].includes(search?.value);
                      })

                      setData(searchedDatas);
                  } else {
                      setData(collectionDatas);
                  }

                
                setLoading(false);
                setError('');
              }
             
            });
        }, [qRef,search?.field,search?.value])
        
        return { error, data, loading };
    }

    let getDocument = (colName, id) => {
        
        let [error, setError] = useState('');
        let [data, setData] = useState(null);
        let [loading, setLoading] = useState(false);

        useEffect(() => {
            setLoading(true);
            let ref = doc(db, colName, id);
            
    
            // getDoc(ref).then(doc => {
            //     if (doc.exists()) {
            //         let document = { id: doc.id, ...doc.data() };
            //         setData(document);
            //         setLoading(false);
            //         setError('');
            //     } else {
            //         setError('no document found');
            //         setLoading(false);
            //     }
    
            // });
    
            // realtime communication 
            onSnapshot(ref, doc => {
                if (doc.exists()) {
                    let document = { id: doc.id, ...doc.data() };
                    setData(document);
                    setLoading(false);
                    setError('');
                } else {
                    setError('no document found');
                    setLoading(false);
                }
    
            })
        }, [id])
        
        return { error, loading, data };
    }

    let addCollection = async (colName, data) => {
        try {
            setLoading(true);
            data.date = serverTimestamp()
            let ref = collection(db, colName);
            await addDoc(ref, data)
            setLoading(false);
            setError(null);
        } catch (e) {
            setLoading(false);
            setError(e.message);
            
        }

    }

    let deleteDocument = async (colName, id) => {
        let ref = doc(db, colName, id);

        return deleteDoc(ref);
    }

    let updateDocument = async (colName, id, data, updateDate = true) => {
        try {
            setLoading(true)
            if (updateDate) {
                data.date = serverTimestamp()
            }
            let ref = doc(db, colName, id);
            await updateDoc(ref, data);
            setLoading(false);
            setError(null);
        } catch (e) {
            setLoading(false);
            setError(e.message)
        }
        
    }

    return {error,loading,getCollection,getDocument, addCollection, deleteDocument, updateDocument}
}
