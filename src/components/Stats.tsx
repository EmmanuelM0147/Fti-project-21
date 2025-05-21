import React from 'react';
import { Users, Award, Building, Briefcase } from 'lucide-react';

const stats = [
  { id: 1, name: 'Students Enrolled', value: '50+', icon: Users },
  { id: 2, name: 'Graduation Rate', value: '94%', icon: Award },
  { id: 3, name: 'Industry Partners', value: '20+', icon: Building },
  { id: 4, name: 'Employment Rate', value: '92%', icon: Briefcase },
];

export function Stats() {
  return (
    <section className="bg-blue-600 dark:bg-blue-800 py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="bg-blue-500/50 dark:bg-blue-700/50 rounded-lg p-6 text-center transform transition-all hover:scale-105"
              >
                <div className="flex justify-center">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-extrabold text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-lg font-medium text-blue-100">
                    {stat.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}