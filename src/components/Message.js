import React from 'react';
// propTypes prop 받은 object의 타입 검사 해주는 라이브러리
import PropTypes from 'prop-types';
import { formatRelative } from 'date-fns';

const formatDate = date => {
  let formattedDate = '';
  if (date) {
    // Convert the date in words relative to the current date
    formattedDate = formatRelative(date, new Date());
    // Uppercase the first letter
    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }
  return formattedDate;
};

const Message = ({ message, curId }) => {

  if (!message.text) return null;

  return (
      <>
        <div
          className={`flex items-start flex-wrap p-4 ${
            message.uid === curId && "flex-row-reverse"
          }`}
        >
          {curId !== message.uid && (
            <>
              {/*  상대방 프로필 사진 */}
              <div className={`w-10 ${message.uid === curId ? "" : "mr-2"}`}>
                {" "}
                <img
                  src={message.photoURL ? message.photoURL : "/gray.png"}
                  alt="Avatar"
                  className="rounded-full mr-4 h-10 w-10"
                  width={45}
                  height={45}
                />
              </div>
            </>
          )}
          {/* 채팅 내용. 사용자 별로 색깔 구분 */}
          <div
            className={`p-2 rounded-lg  ${
              message.uid === curId ? "bg-red-400 text-white " : "bg-gray-100"
            }`}
          >
          {message.text}
          </div>
          <div className="text-gray-400 text-xs mx-2 flex flex-col">
            {message.createdAt?.seconds ? (
              <span
                className={`text-gray-500 text-xs ${
                  message.uid === curId && "flex-row-reverse"
                }`}
              >
                {formatDate(new Date(message.createdAt.seconds * 1000))}
              </span>
            ) : null}
          </div>
        </div>
      </>
  );
};

Message.propTypes = {
  text: PropTypes.string,
  createdAt: PropTypes.shape({
    seconds: PropTypes.number,
  }),
  displayName: PropTypes.string,
  photoURL: PropTypes.string,
};

export default Message;
