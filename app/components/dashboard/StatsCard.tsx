"use client";

import { MdOutlineTask }    from "react-icons/md";

import CircleProgress from "./CircleProgress";

interface Props {
    completed: number;
    inProgress: number;
    notStarted: number;
}

export default function StatsCard({
    completed,
    inProgress,
    notStarted,
}: Props) {

    const total =
        completed +
        inProgress +
        notStarted;

    const completedPercent =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );

    const inProgressPercent =
        total === 0
            ? 0
            : Math.round(
                (inProgress / total) * 100
            );

    const notStartedPercent =
        total === 0
            ? 0
            : Math.round(
                (notStarted / total) * 100
            );

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm">

            <h3
                className="text-sm font-semibold
                flex items-center text-[#FF6767]  gap-2 mb-4"
            >
                <MdOutlineTask size={18} className="text-gray-400"/>
                Task Status
            </h3>

            <div
                className="flex justify-between
                items-center"
            >

                <CircleProgress
                    value={completedPercent}
                    color="#05A301"
                    label="Completed"
                />

                <CircleProgress
                    value={inProgressPercent}
                    color="#0225FF"
                    label="In Progress"
                />

                <CircleProgress
                    value={notStartedPercent}
                    color="#F21E1E"
                    label="Not Started"
                />

            </div>

        </div>
    );
}

// import { MdOutlineTask } from "react-icons/md";

// interface Props {
//   completed: number;
//   inProgress: number;
//   notStarted: number;
// }

// export default function StatsCard({ completed, inProgress, notStarted }: Props) {
//   return (
//     <div className="bg-white rounded-xl p-4 shadow-sm ">
//       <h3 className="text-sm font-semibold flex items-center gap-2 mb-4"> <MdOutlineTask />Task Status</h3>

//       <div className="flex justify-between text-center text-sm">
//         <div>
//           <p className="text-green-500 font-bold">{completed}</p>
//           <p className="text-gray-500">Completed</p>
//         </div>

//         <div>
//           <p className="text-blue-500 font-bold">{inProgress}</p>
//           <p className="text-gray-500">In Progress</p>
//         </div>

//         <div>
//           <p className="text-red-500 font-bold">{notStarted}</p>
//           <p className="text-gray-500">Not Started</p>
//         </div>
//       </div>
//     </div>
//   );
// }