import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import useFirestore from '../hooks/useFirestore';
import moment from 'moment';
import trash from "../assets/trash.svg"
import pencil from "../assets/pencil.svg"
import NoteForm from "./NoteForm"

export default function NoteList() {

    let { id } = useParams();
    let { getCollection,deleteDocument } = useFirestore();

    let { error, data: notes, loading } = getCollection('notes', ['bookUid', '==', id]);

    let [editNote, setEditNote] = useState(null);

    let deleteNote= async (id)=>{
        await deleteDocument('notes', id);
    }

  return (
      !!notes && (
          notes.map(note => (
            <div key={note.id} className='border-2 shadow-md p-3 my-3'>
                <div className='flex space-x-3 justify-between'>
                    <div className='flex space-x-3'>
                        <img src="https://cdn-icons-png.freepik.com/512/3135/3135715.png" alt="" className='w-12 h-12 rounded-full' />
                        <div>
                            <h3>Soe Soe</h3>
                            <div className='text-gray-400'>{moment(note?.date?.seconds * 1000).fromNow() }</div>
                        </div>
                    </div>
                    <div>
                        <img onClick={()=>setEditNote(note)} src={pencil} alt="" className='cursor-pointer'/>
                        <img onClick={()=>deleteNote(note.id)} src={trash} alt="" className='cursor-pointer'/>
                    </div>
                    
                </div>
                <div className='mt-3'>
                      {editNote?.id !== note.id && note.body}
                      {editNote?.id === note.id  && <NoteForm type="update" setEditNote={setEditNote} editNote={editNote}/>}
                </div>
            </div>
          ))
    )
  )
}
