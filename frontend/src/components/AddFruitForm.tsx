import React, { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';

// Define props interface
interface AddFruitFormProps {
  addFruit: (name: string) => Promise<boolean | void>;
}

const AddFruitForm: React.FC<AddFruitFormProps> = ({ addFruit }) => {
  const [fruitName, setFruitName] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (fruitName.trim() && !submitting) {
      setSubmitting(true);
      try {
        await addFruit(fruitName);
        setFruitName('');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFruitName(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={fruitName}
        onChange={handleChange}
        placeholder="Enter fruit name"
        disabled={submitting}
      />
      <button type="submit" disabled={submitting || !fruitName.trim()}>
        {submitting ? 'Adding...' : 'Add Fruit'}
      </button>
    </form>
  );
};

export default AddFruitForm; 