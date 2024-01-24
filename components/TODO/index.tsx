'use client';
import { FormEvent, useEffect, useRef, useState } from 'react';

type ListElementType = { id: number; title: string; checked: boolean };

export const TODO = () => {
  const [loading, setLoading] = useState(true);
  const [localState, setLocalState] = useState<ListElementType[]>([]);
  const ref = useRef<HTMLInputElement>(null);

  const handleAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = ref.current?.value;
    if (!value || value.length === 0) return;

    const localStorageData = localStorage.getItem('TODO');
    const refId = Number(ref.current.getAttribute('data-edit-id'));

    const elementToEdit = localState.find((item) => item.id === refId);
    const isSmthToEdit = refId !== 0 && elementToEdit;

    const newElement: ListElementType = isSmthToEdit
      ? { ...elementToEdit, title: value }
      : { id: Date.now(), title: value, checked: false };

    if (!localStorageData) {
      localStorage.setItem('TODO', JSON.stringify([newElement]));
      setLocalState([newElement]);
    } else if (isSmthToEdit) {
      const parsed = localState.map((item) =>
        item.id === refId ? newElement : item,
      );

      localStorage.setItem('TODO', JSON.stringify(parsed));
      setLocalState(parsed);
      ref.current.setAttribute('data-edit-id', '0');
    } else {
      const parsed = JSON.parse(localStorageData);
      parsed.push(newElement);

      localStorage.setItem('TODO', JSON.stringify(parsed));
      setLocalState(parsed);
    }

    ref.current.value = '';
  };

  const handleRemove = (id: number) => {
    if (!localState.length) return;

    setLocalState((prev) => {
      const filteredData = prev.filter((item) => item.id !== id);
      localStorage.setItem('TODO', JSON.stringify(filteredData));
      return filteredData;
    });
  };

  const handleCheck = (id: number) => {
    if (!localState.length) return;

    setLocalState((prev) => {
      const filteredData = prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      );
      localStorage.setItem('TODO', JSON.stringify(filteredData));
      return filteredData;
    });
  };

  const handleEdit = (id: number) => {
    if (!localState.length) return;

    const elementToEdit = localState.find((item) => item.id === id);
    if (!elementToEdit || !ref.current) return;

    ref.current.value = elementToEdit.title;
    ref.current.setAttribute('data-edit-id', elementToEdit.id.toString());
  };

  useEffect(() => {
    const localState = localStorage.getItem('TODO');

    if (localState) {
      setLocalState(JSON.parse(localState));
    }

    setLoading(false);
  }, []);

  return (
    <div className="flex w-[500px] flex-col gap-2 text-center">
      <h1>TODO APP</h1>
      <hr style={{ borderTop: '1px solid black' }} />
      <form onSubmit={handleAdd}>
        <input ref={ref} type="text" placeholder="Add smth" data-edit-id={0} />
        <button type="submit" style={{ border: '1px solid black' }}>
          ADD
        </button>
      </form>
      {loading ? (
        <ul>
          {[...Array(10)].map((_, index) => (
            <li
              key={index}
              className="mb-4 h-[44px] w-full min-w-full max-w-sm animate-pulse rounded-md bg-gray-200 p-2"
            ></li>
          ))}
        </ul>
      ) : null}
      {localState.length > 0 && (
        <ul className="flex flex-col gap-2">
          {localState.map((item, index) => (
            <ListItem
              key={index}
              item={item}
              handleRemove={() => handleRemove(item.id)}
              handleCheck={() => handleCheck(item.id)}
              handleEdit={() => handleEdit(item.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

interface Props {
  item: ListElementType;
  handleRemove: () => void;
  handleCheck: () => void;
  handleEdit: () => void;
}

const ListItem = ({ item, handleRemove, handleCheck, handleEdit }: Props) => {
  const [checked, setChecked] = useState(item.checked);

  return (
    <li
      className={`flex items-center justify-between rounded-md bg-gray-200 p-2`}
    >
      <span
        className={`max-w-[300px] break-all text-left ${
          checked ? 'text-gray-500 line-through' : 'text-black'
        }`}
      >
        {item.title}
      </span>
      <div className="flex items-center justify-center gap-1">
        <button
          title="edytuj"
          className="mr-2 flex items-center justify-center border-2 border-solid border-black px-1"
          onClick={handleEdit}
        >
          Edit
        </button>
        <button
          title="usuń"
          className="mr-2 flex h-[24px] w-[24px] items-center justify-center border-2 border-solid border-black"
          onClick={handleRemove}
        >
          x
        </button>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => {
            setChecked((prev) => !prev);
            handleCheck();
          }}
          className="form-checkbox ml-2 h-5 w-5 text-blue-500"
        />
      </div>
    </li>
  );
};
