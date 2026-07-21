import { getTasks } from "@/queries/tasks";
import { FieldGroup } from "@/components/ui/field";
import { TaskItem } from "@/components/task-item";
import { TaskForm } from "@/components/task-form";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import WeatherWidget from "@/components/weather-widget";

export default async function Tasks() {
  const { tasks, porcentage, completed, total } = await getTasks();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between">
        <h2 className="scroll-m-20 pb-4 text-3xl tracking-tight pt-8">
          <span className="font-semibold">dot</span> • Tarefas
        </h2>
        <WeatherWidget />
      </div>

      <TaskForm />

      <Progress
        value={porcentage}
        className="w-full"
        indicatorClassName="bg-green-500"
      >
        <ProgressLabel>
          {completed}/{total}
        </ProgressLabel>
        <ProgressValue />
      </Progress>

      <FieldGroup>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            id={task.id}
            name={task.name}
            isCompleted={task.isCompleted}
          />
        ))}
      </FieldGroup>
    </div>
  );
}
