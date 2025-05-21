/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

const classNameLoader = 'modal-background has-background-white-ter';

type Props = {
  todo: Todo;
  selectedTodo?: Todo;
  setSelectedTodo: React.Dispatch<React.SetStateAction<Todo | undefined>>;
  deleteChosenTodo: (todoToDel: Todo) => Promise<void>;
  updateChosenTodo: (todoSetToUpdate: Todo | null) => void;
  deletingIds: number[];
  togglingIds: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  selectedTodo,
  setSelectedTodo,
  deleteChosenTodo,
  updateChosenTodo,
  deletingIds,
  togglingIds,
}) => {
  const [inputValue, setInputValue] = useState(todo.title);
  const [loader, setLoader] = useState(false);
  const titleFieldRef = useRef<HTMLInputElement>(null);
  const isDeleting = deletingIds.includes(todo.id);
  const isToggling = togglingIds.includes(todo.id);

  const handleDelete = async (todoToDel: Todo) => {
    setLoader(true);

    await new Promise(resolve => setTimeout(resolve, 100));

    await deleteChosenTodo(todoToDel);

    setLoader(false);
  };

  const handleUpdate = async (todoToUp: Todo) => {
    setLoader(true);

    await new Promise(resolve => setTimeout(resolve, 100));

    await updateChosenTodo(todoToUp);

    setLoader(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlurOrSubmit = () => {
    if (inputValue !== todo.title) {
      if (inputValue === '') {
        handleDelete(todo);
      } else {
        handleUpdate({
          id: todo.id,
          title: inputValue.trim(),
          userId: 2400,
          completed: todo.completed,
        });
      }
    }

    if (inputValue === todo.title) {
      setSelectedTodo(undefined);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setInputValue(todo.title);
      setSelectedTodo(undefined);
    }
  };

  useEffect(() => {
    if (todo === selectedTodo) {
      titleFieldRef.current?.focus();
    }
  }, [selectedTodo, todo]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() =>
            handleUpdate({
              id: todo.id,
              title: inputValue.trim(),
              userId: 2400,
              completed: !todo.completed,
            })
          }
        />
      </label>

      {todo !== selectedTodo ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setSelectedTodo(todo)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo)}
          >
            ×
          </button>
        </>
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleBlurOrSubmit();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlurOrSubmit}
            onKeyUp={handleKeyUp}
            ref={titleFieldRef}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loader || isDeleting || isToggling,
        })}
      >
        <div className={classNameLoader} />
        <div className="loader" />
      </div>
    </div>
  );
};
