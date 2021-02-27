import React, { useState, useEffect } from 'react';

const Todo = () => {
    const [tasks, setTasks] = useState([])
    const [activeItem, setItem] = useState({
        id: null,
        title: '',
        is_completed: false
    })
    const [editing, setEditing] = useState({
        editing: false
    })

    console.log('render')
    useEffect(() => {
        fetchTasks()
    }, [])

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function fetchTasks(){
        console.log('Fetching...')
        fetch('http://127.0.0.1:8000/api/task-list/')
        .then(response => response.json())
        .then(data => 
            setTasks(data)
            )
    }

    function handleChange(e){
        var name = e.target.name
        var value = e.target.value
        console.log('Name:', name)
        console.log('Value: ', value)

        setItem({
            ...activeItem, title:value
        })
    }

    function handleSubmit(e){
        e.preventDefault()
        console.log('ITEM: ', activeItem)

        var csrftoken = getCookie('csrftoken');
        var url = 'http://127.0.0.1:8000/api/task-create/'

        if(editing === true){
            url = `http://127.0.0.1:8000/api/task-update/${activeItem.id}/`
            setEditing(false)
        }
        
        fetch(url, {
            method:'POST',
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken': csrftoken
            },
            body:JSON.stringify(activeItem)})
            .then((response) => {
                fetchTasks()
                setItem({
                    id: null,
                    title: '',
                    is_completed: false,
                })})
            .catch(function(error){
            console.log('ERROR: ', error)
        })
        }

    function edit(task){
        setItem(task)
        setEditing(true)
    }
    
    function deleteItem(task){
        var csrftoken = getCookie('csrftoken')

        fetch(
            `http://127.0.0.1:8000/api/task-delete/${task.id}/`, 
            {method:'DELETE',
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken': csrftoken,
            },
            }).then((response) =>{
                fetchTasks()
            })
    }

    function editTaskStatus(task){
        task.is_completed = !task.is_completed

        var csrftoken = getCookie('csrftoken')
        var url = `http://127.0.0.1:8000/api/task-update/${task.id}/`

        fetch(url, {
            method:'POST',
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(task)
        }).then((response) => {
            fetchTasks()
        })
    }
    
    return (
        <div className='container'>
            
            <div id='task-container'>
                <div id='form-wrapper'>
                    <form onSubmit={handleSubmit}>
                        <input maxLength={40} onChange={handleChange} name='title' value={activeItem.title} type="text" id='input-field' placeholder='Add Task...'/>
                        <button id='submit-button'> Add </button>
                    </form>
                </div>
                <div id='list-wrapper'>
                {tasks.map(task => {
                        return <div  key={task.id} className='task-wrapper' onClick={() => editTaskStatus(task)}>
                                    
                                    <div className='task-title-wrapper' >
                                        {task.is_completed === false ? (
                                            <span className='task-span'>{task.title}</span>
                                        ) : (
                                            <span className='task-span'>
                                                <strike>
                                                    {task.title}
                                                </strike>
                                                
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className='btn-wrapper'>
                                        <button onClick={() => edit(task)} className='edit-btn'>Edit</button>
                                        <button onClick={() => deleteItem(task)}className='delete-btn'>X</button>
                                    </div>
                                    
                                </div>
                    })}
                </div>
            </div>

        
         </div>
    )
}

export default Todo
