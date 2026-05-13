"use client";

import {
    RadialBarChart,
    RadialBar,
    PolarAngleAxis
} from "recharts";

interface Props {
    value: number;
    color: string;
    label: string;
}

export default function CircleProgress({
    value,
    color,
    label,
    
}: Props) {

    const data = [
        {
            name: label,
            value,
            fill: color,
        },
    ];

    return (
        <div className="flex flex-col items-center">

            <div className="relative w-[80px] h-[80px]">

                <RadialBarChart
                    width={80}
                    height={80}
                    cx="50%"
                    cy="50%"
                    innerRadius="70%"
                    outerRadius="90%"
                    barSize={10}
                    data={data}
                    startAngle={90}
                    endAngle={-270}
                >
                    <PolarAngleAxis
                        type="number"
                        domain={[0, 100]}
                        tick={false}
                    />
                    <RadialBar
                        dataKey="value"
                        cornerRadius={10}
                        background={{ fill: "#e5e7eb" }}
                    />

                </RadialBarChart>

                <div
                    className="absolute inset-0
                    flex items-center justify-center"
                >
                    <span className="text-sm font-semibold">
                        {value}%
                    </span>
                </div>

            </div>

            <div className="flex items-center gap-2 mt-2">

                <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                />

                <p className="text-sm text-gray-700">
                    {label}
                </p>

            </div>

        </div>
    );
}