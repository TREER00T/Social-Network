import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";

export default function TabView({className, id}) {
    const data = [
        {
            label: "All",
            value: "All",
            desc: `It really matters and then like it really doesn't matter.
      What matters is the people who are sparked by it. And the people 
      who are like offended by it, it doesn't matter.`,
        },
        {
            label: "E2E",
            value: "E2E",
            desc: `Because it's about motivating the doers. Because I'm here
      to follow my dreams and inspire other people to follow their dreams, too.`,
        },
        {
            label: "Group",
            value: "Group",
            desc: `Because it's about motivating the doers. Because I'm here
      to follow my dreams and inspire other people to follow their dreams, too.`,
        },

        {
            label: "Channel",
            value: "Channel",
            desc: `We're not always in the position that we want to be at.
      We're constantly growing. We're constantly making mistakes. We're 
      constantly trying to express ourselves and actualize our dreams.`,
        }
    ];

    return (
        <div className="block overflow-hidden">
            <nav>
                <ul role="tablist" className="flex relative bg-blue-gray-50 bg-opacity-60 rounded-lg p-1">
                    <li role="tab"
                        className="grid place-items-center text-center w-full h-full relative bg-transparent p-1 text-blue-gray-900 antialiased font-sans text-base font-normal leading-relaxed select-none cursor-pointer"
                        data-value="All">
                        <div className="z-20">All</div>
                    </li>
                    <li role="tab"
                        className="grid place-items-center text-center w-full h-full relative bg-transparent p-1 text-blue-gray-900 antialiased font-sans text-base font-normal leading-relaxed select-none cursor-pointer"
                        data-value="E2E">
                        <div className="z-20">E2E</div>
                    </li>
                    <li role="tab"
                        className="grid place-items-center text-center w-full h-full relative bg-transparent p-1 text-blue-gray-900 antialiased font-sans text-base font-normal leading-relaxed select-none cursor-pointer"
                        data-value="Group">
                        <div className="z-20">Group</div>
                    </li>
                    <li role="tab"
                        className="grid place-items-center text-center w-full h-full relative bg-transparent p-1 text-blue-gray-900 antialiased font-sans text-base font-normal leading-relaxed select-none cursor-pointer"
                        data-value="Channel">
                        <div className="z-20">Channel</div>
                        <div className="absolute top-0 left-0 right-0 z-10 h-full bg-white rounded-md shadow"
                             data-projection-id="11" style="transform: none; transform-origin: 50% 50% 0px;"></div>
                    </li>
                </ul>
            </nav>
            <div className="block w-full relative bg-transparent overflow-hidden">
                <div role="tabpanel"
                     className="w-full h-max text-gray-700 p-4 antialiased font-sans text-base font-light leading-relaxed"
                     data-value="All"
                     style="opacity: 0; position: absolute; top: 0px; left: 0px; z-index: 1; transform: translateY(250px) translateZ(0px);">It
                    really matters and then like it really doesn't matter.
                    What matters is the people who are sparked by it. And the people
                    who are like offended by it, it doesn't matter.
                </div>
                <div role="tabpanel"
                     className="w-full h-max text-gray-700 p-4 antialiased font-sans text-base font-light leading-relaxed"
                     data-value="E2E"
                     style="opacity: 0; position: absolute; top: 0px; left: 0px; z-index: 1; transform: translateY(250px) translateZ(0px);">Because
                    it's about motivating the doers. Because I'm here
                    to follow my dreams and inspire other people to follow their dreams, too.
                </div>
                <div role="tabpanel"
                     className="w-full h-max text-gray-700 p-4 antialiased font-sans text-base font-light leading-relaxed"
                     data-value="Group"
                     style="opacity: 0; position: absolute; top: 0px; left: 0px; z-index: 1; transform: translateY(250px) translateZ(0px);">Because
                    it's about motivating the doers. Because I'm here
                    to follow my dreams and inspire other people to follow their dreams, too.
                </div>
                <div role="tabpanel"
                     className="w-full h-max text-gray-700 p-4 antialiased font-sans text-base font-light leading-relaxed"
                     data-value="Channel"
                     style="opacity: 1; position: relative; top: auto; left: auto; z-index: 2; transform: none;">We're
                    not always in the position that we want to be at.
                    We're constantly growing. We're constantly making mistakes. We're
                    constantly trying to express ourselves and actualize our dreams.
                </div>
            </div>
        </div>
    );
}