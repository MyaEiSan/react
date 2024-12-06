import { useContext, useEffect, useState } from 'react'
// import useFetch from "../hooks/useFetch"
import { useNavigate, useParams } from 'react-router-dom';
import useTheme from '../hooks/useTheme';
import { db, storage } from '../firebase';
import useFirestore from '../hooks/useFirestore';
import {AuthContext} from "../contexts/AuthContext"
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { doc, getDoc } from 'firebase/firestore';

export default function BookForm() {

  let { id } = useParams();

  let [title, setTitle] = useState('');
  let [description, setDescription] = useState('');
  let [newCategory, setNewCategory] = useState('');
  let [categories, setCategories] = useState([]);
  let [isEdit, setIsEdit] = useState(false);
  let [file, setFile] = useState(null);
  let [preview, setPreview] = useState('');

  let { loading,addCollection, updateDocument } = useFirestore();

  let { user } = useContext(AuthContext);

  useEffect(() => {
    if (id) {
      // edit form 
      setIsEdit(true);
      let ref = doc(db, 'books', id);
        getDoc(ref).then(doc => {
          
            if (doc.exists()) {
              let { title, description, categories,cover } = doc.data();
              setTitle(title);
              setDescription(description);
              setCategories(categories);
              setPreview(cover)
            } 

        });
    } else {
      // create form 
      setIsEdit(false);
      setTitle('');
      setDescription('');
      setCategories([]);
    }
  },[])

  // let {setPostData, data:book,loading} = useFetch('http://localhost:3000/books', "POST")
  let navigate = useNavigate();

  let addCategory = () => {
    if (newCategory && categories.includes(newCategory)) {
      setNewCategory('');
      return;
    }
    setCategories(prev => [newCategory, ...prev]);
    setNewCategory('');
  }

  let handlePhotoChange = (e) => {
    setFile(e.target.files[0])
  }

  let handlePreviewImage = (file) => {
    let reader = new FileReader; 
    reader.readAsDataURL(file);

    reader.onload = () => {
      setPreview(reader.result);
    }


  }

  useEffect(() => {
    if (file) {
      handlePreviewImage(file)
    }
  }, [file])
  
  let uploadToFirebase = async (file) => {
    let uniqueFileName = Date.now().toString() + '_' + file.name;
    let path = "/covers/" + user.uid + "/" + uniqueFileName
    let storageRef = ref(storage,path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef)
  }

  let submitForm = async (e) => {
    e.preventDefault();
    let url = file?await uploadToFirebase(file):preview;

    let data = {
      title,
      description,
      categories,
      uid: user.uid,
      cover: url
    }

    
    if (isEdit) {
      await updateDocument('books', id, data);
      navigate('/');
    } else {
      await addCollection('books', data);
      navigate('/');
    }
      
    
   
  }

  // useEffect(() => {
  //   if (book) {
  //     navigate('/');
  //   }
  // }, [book])
  
  let { isDark } = useTheme();
  

  return (
    <div className='h-screen'>
      <form className="w-full max-w-lg mx-auto mt-5" onSubmit={submitForm}>
   
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ${isDark?'text-white':''}`} htmlFor="grid-title">
              Book Title
            </label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-title" type="text" placeholder="Book Title"/>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ${isDark?'text-white':''}`} htmlFor="grid-descripttion">
              Book Description
            </label>
            
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-descripttion" placeholder="Book Description"></textarea>
            <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you woud like</p>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ${isDark?'text-white':''}`} htmlFor="grid-password">
              Categories
            </label>
            <div className="flex items-center space-x-2">
              <input value={newCategory} onChange={e => setNewCategory(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-category" type="text" placeholder="Book Category"/>
              <button type='button' onClick={addCategory} className="bg-primary p-1 rounded-lg mb-3 ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 p-1 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </button>
            </div>
            
          </div>
          <div className="flex flex-wrap">
              {categories.map(c => (
              <span key={c} className="mx-1 my-1 text-white rounded-full px-2 py-1 text-sm bg-primary">{c}</span>
              ))}
              
          </div>
          
        </div>
        <div className="w-full px-3 my-3">
            <label className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ${isDark?'text-white':''}`} htmlFor="grid-title">
              Book Cover
            </label>
            <input type='file' name='' id="" onChange={handlePhotoChange} />
            {!!preview && <img src={preview} alt="" className='my-3' width={500} height={500} />}
        </div>
        {/* create book  */}
        
        <button className='text-white bg-primary px-3 py-2 rounded-2xl flex justify-center items-center gap-1 w-full'>
          {!!loading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>}
           {!loading && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>}

          <span className='hidden md:block'>{isEdit ?'Update': 'Create'} book</span>
        </button>
      </form>
    </div>
  )
}
