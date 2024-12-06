import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch';
import useTheme from '../hooks/useTheme';
import useFirestore from '../hooks/useFirestore';
import NoteForm from '../components/NoteForm';
import NoteList from '../components/NoteList';
import { AuthContext } from '../contexts/AuthContext';

export default function BookDetail() {
    // dynamic id 
    let { user } = useContext(AuthContext)
    let { id } = useParams();
    let { getDocument } = useFirestore();
    let { error, loading, data: book} = getDocument('books',id);
    let { isDark } = useTheme();


    

    // let url = "http://localhost:3000/books/" +id;
    // let { data: book, loading, error } = useFetch(url);

    
    return (
        <>
            {error && <p>{error}</p>}
            {loading && <p>Loading...</p>}
            {!!book && (
                <>
                    <div className={`grid grid-cols-2 ${isDark?'text-white':''}`}>
                        <div>
                            <img src={book.cover} alt='' className='w-[80%]'/>
                        </div>
                        <div className='space-y-4'>
                            <h1 className='text-3xl font-bold'>{book.title}</h1>
                            <div className='space-x-3'>
                                {book.categories.map(category => (
                                    <span className='bg-blue-500 text-white rounded-full text-sm px-2 py-1' key={category}>{category}</span>
                                ))}
                            </div>
                            <p>
                                {book.description}
                            </p>
                        </div>
                    </div>
                    <div>
                        <h3 className='font-bold text-xl text-primary my-3 text-center'>My Notes</h3>
                        <NoteForm/>
                        <NoteList/>
                    </div>
                </>
            )}
        </>
  )
}
