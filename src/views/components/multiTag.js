// ** Custom Components
import Avatar from '@components/avatar'
import { useState } from 'react'
import * as Icons from 'react-feather'
export default function MultiTags (props) {
    const [tags, setTags] = useState([])
    let addTag = (e) => {
        if(e.key === "Enter" && e.target.value !== ""){
            setTags([...tags, e.target.value])
            props.selected([...tags, e.target.value])
            e.target.value = ""
        }
    }

    let removeTag = indexToRemove => {
        setTags(tags.filter((_, index) => index !== indexToRemove))
        let removed = tags.filter((_, index) => index !== indexToRemove)
        props.removed(removed)
    }
    return (
        <div id={props.id} className="tagsInput form-input">
            <ul>
                {
                    tags.map((tag, index) => 
                        <li key={index}>
                            <span className='tag'>{tag}</span>
                            <Avatar size='sm' color='primary' icon={<Icons.X size={12} onClick = {() => removeTag(index)}/>} />
                        </li>
                    )
                }
                
            </ul>
            <input type='text' className='form-input' placeholder={'text'} onKeyUp = {addTag} />
        </div>
    )
}