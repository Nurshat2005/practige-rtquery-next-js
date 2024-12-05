'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import scss from './TodoList.module.scss';
import { usePostTodoMutation, useUplaodTodoMutation } from '@/redux/api/todo';

interface IDataTodo {
  name: string;
  url: string;
  price: number;
  file: FileList;
}

const TodoList = () => {
  const [saveMutation] = usePostTodoMutation();
  const { register, handleSubmit, reset } = useForm<IDataTodo>();
  const [uplaodFile] = useUplaodTodoMutation();

  const saveData: SubmitHandler<IDataTodo> = async (data) => {
    try {
      const file = data.file[0];
      const formData = new FormData();
      formData.append('file', file);
      const { data: responseFile } = await uplaodFile(formData);
      const newData = {
        name: data.name,
        url: data.url,
        price: data.price,
        file: responseFile.url,
      };
      await saveMutation(newData);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className={scss.TodoList}>
      <div className="container">
        <div className={scss.content}>
          TodoList
          <form onSubmit={handleSubmit(saveData)}>
            <div className={scss.Todo}>
              <input type="text" placeholder="Name" {...register('name', { required: true })} />
              <input type="text" placeholder="Url" {...register('url', { required: true })} />
              <input type="number" placeholder="Price" {...register('price', { required: true })} />
              <input type="file" placeholder="file" {...register('file', { required: true })} />
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default TodoList;
