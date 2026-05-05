import { MdOutlineTask } from "react-icons/md";

interface Props {
  completed: number;
  inProgress: number;
  notStarted: number;
}

export default function StatsCard({ completed, inProgress, notStarted }: Props) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm ">
      <h3 className="text-sm font-semibold flex items-center gap-2 mb-4"> <MdOutlineTask />Task Status</h3>

      <div className="flex justify-between text-center text-sm">
        <div>
          <p className="text-green-500 font-bold">{completed}</p>
          <p className="text-gray-500">Completed</p>
        </div>

        <div>
          <p className="text-blue-500 font-bold">{inProgress}</p>
          <p className="text-gray-500">In Progress</p>
        </div>

        <div>
          <p className="text-red-500 font-bold">{notStarted}</p>
          <p className="text-gray-500">Not Started</p>
        </div>
      </div>
    </div>
  );
}