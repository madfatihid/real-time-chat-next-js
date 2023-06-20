// @ts-nocheck
'use client'

import axios from 'axios';
import Image from 'next/image'
import Pusher from 'pusher-js';
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

var pusher = new Pusher('563763d076d7d2e2fe88', {
  cluster: 'ap1'
});

function Profile(props: any) {
  let hue = 0;
  let name = props.name;
  for (var i = 0; i < name.length; i++) {
    hue += name.toLowerCase().charCodeAt(i) * 10;
  }
  // console.log(hue);
  let acronym = name.split(/\s/).reduce((response: String, word: String) => response += word.slice(0, 1), '');
  let cut = acronym.substring(0, 2);

  return <div className="flex-shrink-0 relative border-2 border-white inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full " style={{ backgroundColor: `hsl(${hue}, 100%, 40%)` }}>
    <span className="font-medium text-white dark:text-white">{cut}</span>
  </div>;
}

function Bubble(props: any) {
  return <div className="flex w-full mt-2 space-x-3 max-w-xs" id={props.id}>
    <Profile name={props.username} />
    <div>
      <div className="bg-slate-200 p-3 rounded-r-lg rounded-bl-lg">
        <p className="text-sm">
          <div className='font-semibold mb-1'>{props.username}</div>{props.content}</p>
      </div>
      <span className="text-xs text-gray-500 leading-none">{new Date(props.timestamp).toLocaleString('en-GB', {
        // timeZone, 
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })}</span>
    </div>
  </div>;
}

function BubbleMe(props: any) {
  // console.log(timeZone);
  return <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end" id={props.id}>
    <div>
      <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
        <p className="text-sm">
          <div className='font-semibold mb-1'>{props.username}</div>{props.content}</p>
      </div>
      <span className="text-xs text-gray-500 leading-none">{new Date(props.timestamp).toLocaleString('en-GB', {
        // timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })}</span>
    </div>
    <Profile name={props.username} />
  </div>;
}

export default function Home() {

  const [showModal, setShowModal] = useState(true);
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const [offset, setOffset] = useState(0);
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [scrollTop, setScrollTop] = useState(0);
  const scrollRef = useRef();

  const [firstchild, setFirstchild] = useState("");
  const [curOffset, setCurOffset] = useState(0);


  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    axios.get(`/api/message?offset=${offset}`)
      .then(function (response) {
        // handle success
        console.log(response.data);
        setFirstchild(scrollRef.current.querySelector("div:nth-child(1)").getAttribute("id"));
        setCurOffset(scrollRef.current.querySelector("div:nth-child(1)").offsetTop - scrollRef.current.scrollTop);
        setMessage(current => [...current, ...response.data]);
        // firstchild.scrollIntoView();
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        setLoading(false);
      });
    setOffset(prevOffset => prevOffset + 10);
  }


  const handleScroll = (event: any) => {
    if (event.currentTarget.scrollTop === 0) {
      console.log("more!");
      loadMore();
    }
  };

  const firstTime = async () => {
    axios.get(`/api/message?offset=${offset}`)
      .then(function (response) {
        // handle success
        console.log(response.data);

        setMessage(current => [...current, ...response.data]);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
        scrollRef.current.scrollTop = 100000;
      });
    setOffset(prevOffset => prevOffset + 10);

  }
  const handleKeyDownContent = (event : any) => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      event.preventDefault();
      // console.log(content);
      handleSubmit(event);
    }
  };

  const handleKeyDownUsername = (event : any) => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      event.preventDefault();
      // console.log(content);
      submitUsername(event);
    }
  };
  
  useEffect(() => {
    var channel = pusher.subscribe('my-channel');
    channel.bind('new-message', function (data: any) {
      // alert(JSON.stringify(data));
      console.log("new", data);
      setMessage(current => [data, ...current]);
      setOffset(prevOffset => prevOffset + 1);
    });
    firstTime();

  }, []);


  useLayoutEffect(() => {
    if (firstchild === "") {
      scrollRef.current.scrollTop = 10000;
      return;
    }
    // console.log("offset", firstchild);
    // scrollRef.current.scrollTop = scrollRef.current.querySelector("bubble_76").offsetTop - curOffset;
    scrollRef.current.scrollTop = scrollRef.current.querySelector("#" + firstchild).offsetTop - curOffset;
    setFirstchild("");
  }, [message])

  // const [last, setLast] = useState('');

  const handleSubmit = (event: any) => {
    // console.log(content);
    event.preventDefault();
    // console.log(content);
    if(content === "") return;
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
    // setContent('');
  };

  return (
    <>
      <main className='flex justify-center bg-gray-100'>
        <div className="flex flex-col w-full max-w-lg h-full bg-black">
          <div className="flex-none flex justify-between items-center px-6 py-3 bg-gray-50 dark:bg-gray-700 h-16">
            <h1 className='font-semibold'>Real Time Chat</h1>
            <div>
              <div className="flex -space-x-4">
                {/* <Profile name="Jason Derulo" />
                <Profile name="AB" />
                <Profile name="LD" /> */}
                {/* <a className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800" href="#">+99</a> */}
              </div>
            </div>
          </div>
          <div ref={scrollRef}
            onScroll={handleScroll} className="flex-auto p-4 bg-white overflow-auto">
            {/* <Car username="Alice" content="Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum" />
          <Car username="Agent" content="What?" />
          <Car username="Alice" content="Lorem ipsum" />
          <Car username="いびき" content="Lorem ipsum" />
          <Car username="Alice" content="Lorem ipsum" />
          <Car2 username="Alice" content="Lorem ipsum" /> */}

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
