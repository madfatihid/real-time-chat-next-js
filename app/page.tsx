// @ts-nocheck
'use client'

import axios from 'axios';
import Pusher from 'pusher-js';
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import { Profile, Bubble, BubbleMe, LoadingLeft, LoadingRight } from './component'
import PulseLoader from "react-spinners/PulseLoader";

export default function Home() {

  const [showModal, setShowModal] = useState(true);
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const [offset, setOffset] = useState(0);
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  const [firstchild, setFirstchild] = useState("");
  const [curOffset, setCurOffset] = useState(0);
  const [atBottom, setAtBottom] = useState(false);

  const [members, setMembers] = useState([]);
  const [typings, setTypings] = useState([]);

  const getScrollPos = () => {
    setFirstchild(scrollRef.current.querySelector("div:nth-child(1)").getAttribute("id"));
    setCurOffset(scrollRef.current.querySelector("div:nth-child(1)").offsetTop - scrollRef.current.scrollTop);
  }
  const setScrollPos = () => {
    scrollRef.current.scrollTop = scrollRef.current.querySelector("#" + firstchild).offsetTop - curOffset;
  }

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    axios.get(`/api/message?offset=${offset}`)
      .then(function (response) {
        console.log(response.data);
        getScrollPos();
        setMessage(current => [...current, ...response.data]);
        setOffset(prevOffset => prevOffset + 10);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        setLoading(false);
      });
  }


  const handleScroll = (event: any) => {
    // console.log(scrollRef.current.scrollHeight - scrollRef.current.scrollTop - scrollRef.current.clientHeight < 1)
    if (event.currentTarget.scrollTop === 0) {
      console.log("more!");
      loadMore();
    }
  };

  const firstTime = async () => {
    axios.get(`/api/message?offset=${offset}`)
      .then(function (response) {
        console.log(response.data);

        setMessage(current => [...current, ...response.data]);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        scrollRef.current.scrollTop = 100000;
      });
    setOffset(prevOffset => prevOffset + 10);

  }
  const handleKeyDownContent = (event: any) => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      event.preventDefault();
      handleSubmit(event);
    }
    // if (content === "")
    //   axios.post('/api/type', {
    //     username: username,
    //     type: "start"
    //   });
    // else
    //   axios.post('/api/type', {
    //     username: username,
    //     type: "stop"
    //   });
  };

  const handleKeyDownUsername = (event: any) => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      event.preventDefault();
      submitUsername(event);
    }
  };

  useLayoutEffect(() => {
    // console.log(scrollRef.current.scrollHeight - scrollRef.current.scrollTop - scrollRef.current.clientHeight);
    if (message.length === 10 || atBottom) {
      console.log("hey its true!");
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight + scrollRef.current.clientHeight;
      setAtBottom(false);
      return;
    }
    if (firstchild !== "") setScrollPos();
    setFirstchild("");
  }, [message])

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (content === "") return;
    axios.post('/api/message', {
      username: username,
      content: content
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      }).finally(function () {

      });

    console.log('form submitted ✅');
    setContent('');
  };

  const submitUsername = (event: any) => {
    event.preventDefault();
    if (username === "") return;
    if (username.length < 3) return;
    if (username.length > 20) return;
    setShowModal(false);

    const pusher = new Pusher('6ba39b4dc9c7f2cfea15', {
      userAuthentication: { endpoint: "/api/auth" },
      channelAuthorization: {
        endpoint: "/api/auth",
        params: {
          username: username
        },
      },
      cluster: 'ap1'
    });

    var channel = pusher.subscribe('my-channel');
    channel.bind('new-message', function (data: any) {
      // console.log("new", data);
      if (scrollRef && scrollRef.current.scrollHeight - scrollRef.current.scrollTop - scrollRef.current.clientHeight < 1)
        setAtBottom(true);
      getScrollPos();
      setMessage(current => [data, ...current]);
      setOffset(prevOffset => prevOffset + 1);
    });
    channel.bind('start-typing', function (data: any) {
      setTypings(current => [...current, data.username]);
    });
    channel.bind('stop-typing', function (data: any) {
      setTypings(current =>
        current.filter(m => {
          // 👇️ remove object that has id equal to 2
          return m !== data.username;
        }),
      );
    });

    var presenceChannel = pusher.subscribe('presence-my-channel');
    presenceChannel.bind("pusher:subscription_succeeded", (members) => {

      // console.log(members);
      let arrs = []
      members.each((member) => {
        // console.log(member);
        arrs.push(member);
      });
      setMembers(current => [...arrs]);
    });
    presenceChannel.bind("pusher:member_added", (member) => {
      setMembers(current => [...current, member]);
      // console.log(member);
    });
    presenceChannel.bind("pusher:member_removed", (member) => {

      setMembers(current =>
        current.filter(m => {
          // 👇️ remove object that has id equal to 2
          return m.id !== member.id;
        }),
      );
      setTypings(current =>
        current.filter(m => {
          // 👇️ remove object that has id equal to 2
          return m !== member.id;
        }),
      );
      // console.log(member);
    });

    firstTime();
  };

  return (
    <>
      <main className='flex justify-center bg-gray-100'>
        <div className="flex flex-col w-full max-w-lg h-full bg-black">
          <div className="flex-none flex justify-between items-center px-6 py-3 bg-gray-50 dark:bg-gray-700 h-16">
            <h1 className='font-semibold'>Real Time Chat</h1>
            <div>
              <div className="flex -space-x-4">
                {
                  [...members].slice(0, 5).map((m, index) => {
                    return <><Profile tooltip="my-tooltip" name={m.id} key={m.id} id={m.id} /></>
                  })
                }
                {
                  (members.length > 5) && <div className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-400 border-2 border-white rounded-full hover:bg-gray-300 dark:border-gray-800 z-10">+{members.length - 5}</div>
                }
              </div>
            </div>
          </div>
          <div ref={scrollRef}
            onScroll={handleScroll} className="flex-auto p-4 bg-white overflow-auto">

            {[...message].reverse().map((m, _) => {
              // console.log(m);
              if (m.username === username)
                return (
                  <BubbleMe username={m.username} content={m.content} timestamp={m.created_at} key={m.id} id={"bubble_" + m.id} />
                );
              return (
                <Bubble username={m.username} content={m.content} timestamp={m.created_at} key={m.id} id={"bubble_" + m.id} />
              );
            })}
            
            {typings.filter(t => t !== username).length > 0 ? <LoadingLeft usernames={typings.filter(t => t !== username)} /> : null}
            {/* <LoadingLeft username="Alice" /> */}
            {typings.includes(username) ? <LoadingRight username={username} /> : null}
          </div>
          <div className="flex-none">
            <form onSubmit={handleSubmit}>
              {/* <label htmlFor="chat" className="sr-only">Your message</label> */}
              <div className="flex items-center px-3 py-3 bg-gray-50 dark:bg-gray-700">
                <textarea id="chat" rows={1} className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..." value={content} onChange={event => setContent(event.target.value)} onKeyDown={handleKeyDownContent}></textarea>
                <button type="submit" className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                  <svg aria-hidden="true" className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                  {/* <span className="sr-only">Send message</span> */}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main >
      <Tooltip id="my-tooltip" />
      {showModal ? (
        <>
          <div className="backdrop-blur-sm bg-black/30 grid place-content-center fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto h-full">
            <div className="relative w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="px-6 py-6 lg:px-8">
                  <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Enter username to continue</h3>
                  <h4 className="mb-4 text-gray-900 dark:text-white">Username must be longer than 3 characters and less than 20 characters</h4>
                  <form className="space-y-6" action="#" onSubmit={submitUsername}>
                    <div>
                      <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Username</label>
                      <input type="text" name="text" onChange={event => setUsername(event.target.value)} onKeyDown={handleKeyDownUsername} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Alice" value={username} required />
                    </div>
                    <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Continue</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null
      }
    </>
  )
}
