import { CSSProperties } from "react";
import PulseLoader from "react-spinners/PulseLoader";

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};


function Profile(props: any) {
    let hue = 0;
    let name = props.name;
    for (var i = 0; i < name.length; i++) {
        hue += name.toLowerCase().charCodeAt(i) * 10;
    }
    let acronym = name.split(/\s/).reduce((response: String, word: String) => response += word.slice(0, 1), '');
    let cut = acronym.substring(0, 2);

    return <div data-tooltip-id={props.tooltip ?? ""} data-tooltip-content={props.name} className="cursor-pointer select-none flex-shrink-0 relative border-2 border-white inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full " style={{ backgroundColor: `hsl(${hue}, 100%, 40%)` }}>
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
    return <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end" id={props.id}>
        <div>
            <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                <p className="text-sm">
                    <div className='font-semibold mb-1'>{props.username}</div>{props.content}</p>
            </div>
            <span className="text-xs text-gray-500 leading-none">{new Date(props.timestamp).toLocaleString('en-GB', {
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

function LoadingLeft(props: any) {
    return <div className="flex w-full mt-2 space-x-3 max-w-xs">
        {(props.usernames.length === 1) ? 
        <Profile name={props.usernames[0]} /> :
        <div className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-400 border-2 border-white rounded-full dark:border-gray-800 z-10">+{props.usernames.length}</div>
        }
        <div>
            <div className="bg-slate-200 p-3 rounded-r-lg rounded-bl-lg">
                <p className="text-sm">
                    {/* <div className='font-semibold mb-1'>{props.username}</div> */}
                    <PulseLoader
                        color={"#333"}
                        loading={true}
                        cssOverride={override}
                        size={8}
                        speedMultiplier={0.8}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </p>
            </div>
        </div>
    </div>;
}
function LoadingRight(props: any) {
    return <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
        <div>
            <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                <p className="text-sm">
                    {/* <div className='font-semibold mb-1'>{props.username}</div> */}
                    <PulseLoader
                        color={"#eee"}
                        loading={true}
                        cssOverride={override}
                        size={8}
                        speedMultiplier={0.8}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    /></p>
            </div>
        </div>
        <Profile name={props.username} />
    </div>;
}

export { Profile, Bubble, BubbleMe, LoadingLeft, LoadingRight };