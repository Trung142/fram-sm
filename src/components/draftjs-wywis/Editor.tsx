import { ContentState, Editor, EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

type Props={
    rawContent?:any
    onAction:(key:string,value:any)=>void
    wrapperStyle?:any
    toolbarStyle?:any
    editorStyle?:any
    changeKey:string
    onChangeExampleValue?: boolean
}

const EditorContent:React.FC<Props> = ({ onAction,rawContent,wrapperStyle,toolbarStyle,editorStyle,changeKey, onChangeExampleValue})=>{
    const Editor = dynamic(
        () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
        { ssr: false }
      )

      const[editorState,setEditorState]=useState(rawContent?EditorState.createWithContent(convertFromRaw(JSON.parse(rawContent))):EditorState.createEmpty())
      
      const onEditorStateChange=((content:EditorState)=>{
        setEditorState(content)
        const rawContent=convertToRaw(content.getCurrentContent())
        const stringContent=JSON.stringify(rawContent)
        onAction(changeKey,stringContent)
      })
      useEffect(() => {setEditorState(rawContent?EditorState.createWithContent(convertFromRaw(JSON.parse(rawContent))):EditorState.createEmpty())}, [onChangeExampleValue])
    return(
         
        <Editor
            wrapperStyle={wrapperStyle}
            toolbarStyle={toolbarStyle}
            editorStyle={editorStyle}
            editorState={editorState}
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            toolbarClassName='toolbarClassName'
            onEditorStateChange={onEditorStateChange}
        />      
    )
}
export default EditorContent       