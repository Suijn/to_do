import React, { useState, useEffect } from 'react';
import Logout from './Logout'

import {connect, useSelector, useDispatch} from 'react-redux'
import {getItems, addItem, editItem, deleteTask, editItemStatus} from '../actions/taskActions'
import { Redirect } from 'react-router';


const Todo = () => {
    let tasks = useSelector(state => state.tasks.tasks)
    const dispatch = useDispatch()

    const [activeItem, setItem] = useState({
        id: null,
        title: '',
        is_completed: false
    })
    const [editing, setEditing] = useState({
        editing: false
    })

    useEffect(() => {
        dispatch(getItems())
    }, [])


    function handleChange(e){
        const value = e.target.value

        setItem({
            ...activeItem, title:value
        })
    }

    function handleSubmit(e){
        e.preventDefault()
    
        if(activeItem.title !== ''){
            if(editing === true){
                dispatch(editItem(activeItem))
                setEditing(false)
                setItem({ id: null,
                    title: '',
                    is_completed: false})
            }else{
                dispatch(addItem(activeItem))
                setItem({ id: null,
                    title: '',
                    is_completed: false})
            }
        }
    }

    function edit(task){
        setItem(task)
        setEditing(true)
    }
    
    function deleteItem(task){
        dispatch(deleteTask(task))
        setEditing(false)
    }

    function editTaskStatus(task){
        task.is_completed = !task.is_completed

        dispatch(editItemStatus(task))
    }
    
    return (
        
        <div className='container'>
            <div id='task-container'>
                <div id='form-wrapper'>
                    <Logout></Logout>
                    <form onSubmit={handleSubmit}>
                        <input maxLength={200} onChange={handleChange} name='title' value={activeItem.title} type="text" id='input-field' placeholder='Add Task...'/>
                        <button id='submit-button'> Add </button>
                    </form>
                </div>
                <div id='list-wrapper'>
                {tasks ?
                    tasks.map(task => {
                        return <div  key={task.id} className='task-wrapper'>
                                    <button
                                        onClick={() => editTaskStatus(task)}
                                        className='checkbox'
                                    >
                                        { task.is_completed ? '✔' : '' }
                                    </button>

                                    <div className='task-title-wrapper' >
                                        { !task.is_completed ? 
                                        (
                                                <span className='task-span'>{task.title}</span>
                                        ) : (
                                                <span className='task-span'>
                                                    <strike>{task.title}</strike>
                                                </span>
                                        )}
                                    </div>
                                    
                                    <div className='btn-wrapper'>
                                        <button onClick={() => edit(task)} className='edit-btn'>Edit</button>
                                        <button onClick={() => deleteItem(task)}className='delete-btn'>X</button>
                                    </div>
                                    
                                </div>
                    })
                : null}
                </div>
            </div>

        
         </div>
    )
}



export default Todo;