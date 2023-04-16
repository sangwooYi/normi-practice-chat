import React, { useEffect, useState, useRef } from "react";
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';

import { useFirestoreQuery } from "../hooks";
import PropTypes from 'prop-types';

import Message from "./Message";


function Channel({ user = null }) {

  const db = firebase.firestore();

  const messagesRef = db.collection('messages');
  const messages = useFirestoreQuery(
    messagesRef.orderBy("createdAt", "desc")
  );
  
  const [newMessage, setNewMessage] = useState("");

  const inputRef = useRef();
  const bottomListRef = useRef();
  const { uid, displayName, photoURL } = user;

  // 채팅 작성했을 때 onChanghandler, onSubmitHandler
  const handleOnChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    // 입력한 채팅 공백 제거
    const trimmedMessage = newMessage.trim();
    if (trimmedMessage) {
      // Add new message in Firestore
      messagesRef.add({
        text: trimmedMessage,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        displayName,
        photoURL,
        isRead: false,
      });

      // Clear input field
      setNewMessage("");
      // Scroll down to the bottom of the list
      bottomListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  } 

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  useEffect(() => {
    if (bottomListRef.current) {
      bottomListRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messagesRef]);


  return (
      <div className="flex flex-col h-full">
        <div className="overflow-auto h-full">
          <div className="py-4 max-w-screen-lg mx-auto">
            <div className="border-b dark:border-gray-600 border-gray-200 py-8 mb-4">
              <div className="font-bold text-3xl text-center">
                <p className="mb-1">헬로헬로</p>
                <p className="mb-3">채팅방</p>
              </div>
              <p className="text-gray-400 text-center">
                여기가 시작
              </p>
            </div>
            <ul>
              {messages
                ?.sort((first, second) =>
                  first?.createdAt?.seconds <= second?.createdAt?.seconds ? -1 : 1
                )
                ?.map(message => (
                  <li key={message.id}>
                    <Message message={message} curId={uid}/>
                  </li>
                ))}
            </ul>
            <div ref={bottomListRef} />
          </div>
        </div>
        <div className="mb-6 mx-4">
          <form
            onSubmit={handleOnSubmit}
            className="flex flex-row bg-gray-200 dark:bg-coolDark-400 rounded-md px-4 py-3 z-10 max-w-screen-lg mx-auto dark:text-white shadow-md"
          >
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={handleOnChange}
              placeholder="Type your message here..."
              className="flex-1 bg-transparent outline-none"
            />
            <button
              type="submit"
              disabled={!newMessage}
              className="uppercase font-semibold text-sm tracking-wider text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>
  );
};

Channel.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
  }),
};

export default Channel;