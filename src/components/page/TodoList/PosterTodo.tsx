'use client';
import {
  useDeleteTodoMutation,
  useEditTodoMutation,
  useGetTodoQuery,
  useUplaodTodoMutation,
} from '@/redux/api/todo';
import scss from './PosterTodo.module.scss';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface IDataTodo {
  name: string;
  url: string;
  price: number;
  file: FileList;
}

const PosterTodo = () => {
  const { data } = useGetTodoQuery();
  const [editData] = useEditTodoMutation();
  const [deleteSave] = useDeleteTodoMutation();
  const [editId, setEditId] = useState<number | null>(null);
  const { register, handleSubmit, reset,} = useForm<IDataTodo>();
  const [uplaodFile] = useUplaodTodoMutation();
  const editSave: SubmitHandler<IDataTodo> = async (formData) => {
    try {
      const file = formData.file[0];
      const formDataToUpload = new FormData();
      formDataToUpload.append('file', file);
      const { data: responseFile } = await uplaodFile(formDataToUpload);

      const newData = {
        name: formData.name,
        url: formData.url,
        price: formData.price,
        file: responseFile.url,
      };
      await editData({ _id: editId!, newData });
      reset();
      setEditId(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className={scss.PosterTodo}>
      <div className="container">
        <div className={scss.content}>
          <div className={scss.PosterTodo}>
            {data?.map((el) => (
              <div className={scss.dataTodo} key={el._id}>
                <div className={scss.cardContent}>
                  <h1 className={scss.cardTitle}>{el.name}</h1>
                  <Zoom>
                    <img src={el.url} alt="Url" className={scss.cardImage} />
                  </Zoom>
                  <h2 className={scss.cardPrice}>${el.price}</h2>
                  <Zoom>
                    <img src={el.file} alt="file" className={scss.cardFile} />
                  </Zoom>
                  <button className={scss.deleteButton} onClick={() => deleteSave(el._id)}>
                    Delete
                  </button>
                  <button className={scss.editButton} onClick={() => setEditId(el._id)}>
                    Edit
                  </button>
                </div>
                {editId === el._id && (
                  <form className={scss.editForm} onSubmit={handleSubmit(editSave)}>
                    <input
                      type="text"
                      placeholder="Edit name"
                      {...register('name', { required: true })}
                      className={scss.editInput}
                    />
                    <input
                      type="text"
                      placeholder="Edit Url"
                      {...register('url', { required: true })}
                      className={scss.editInput}
                    />
                    <input
                      type="number"
                      placeholder="Edit Price"
                      {...register('price', { required: true })}
                      className={scss.editInput}
                    />
                    <input type="file" {...register('file')} className={scss.editInput} />
                    <button className={scss.editButton} type="submit">
                      Save
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PosterTodo;
