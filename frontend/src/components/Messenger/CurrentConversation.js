// import React from "react";
// import "./messenger.css";
// import Message from "./Message/Message";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams, Outlet } from "react-router-dom";
// import axios from "axios";
// import { setTheOpenedConversation } from "../redux/reducers/Messenger/index";

// const CurrentConversation = ({ messages, conversations, setMessages }) => {
//   const params = useParams();
//   const user_id = params.userId;
//   const Fid = params.FriendId;

//   const {
//     userinfo,
//     token,
//     userId,
//     conversationFriendInfo,
//     openConversation,
//     theOpenedConversation,
//   } = useSelector((state) => {
//     return {
//       userinfo: state.auth.userinfo,
//       token: state.auth.token,
//       userId: state.auth.userId,
//       conversationFriendInfo: state.messenger.conversationFriendInfo,
//       openConversation: state.messenger.openConversation,
//       theOpenedConversation: state.messenger.theOpenedConversation,
//     };
//   });

//   //   <Outlet />;

//   // //get the right conversation
//   // const conversation = conversations.filter((element) => {
//   //   if (element.members.includes(Number(Fid))) {
//   //     return element;
//   //   }
//   // });

//   // const getAllConversationMessages = () => {
//   //   axios
//   //     .get(`http://localhost:5000/messages/${conversation[0]._id}/${Fid}`, {
//   //       headers: { Authorization: `Bearer ${token}` },
//   //     })
//   //     .then(function (response) {
//   //       console.log(response.data);
//   //       setMessages(response.data);
//   //       setSending(true);
//   //     })
//   //     .catch(function (error) {
//   //       throw error;
//   //     });
//   // };

//   // useEffect(() => {
//   //   getAllConversationMessages();
//   // }, []);

//   // console.log(user_id);
//   // console.log(Fid);
//   // console.log(conversation);



//   return (
//     <div>
//       {messages.map((element) => {
//         // console.log(element);
//         return (
//           <div>
//             <Message
//               message={element}
//               mine={element.sender == userId ? true : false}
//             />
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default CurrentConversation;
