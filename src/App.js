import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
    setSelectedFriend(null);
  }

  function handleSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleUpdateBalance(friendId, newBalance) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === friendId ? { ...friend, balance: newBalance } : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? `Close` : `Add friend`}
        </Button>
      </div>

      {selectedFriend && (
        <FormUpdateBalance
          selectedFriend={selectedFriend}
          onUpdateBalance={handleUpdateBalance}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? `selected` : ``}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even!</p>}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? `Close` : `Select`}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState(``);
  const [image, setImage] = useState(`https://i.pravatar.cc/48`);

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = { name, image: `${image}?=${id}`, balance: 0 };

    onAddFriend(newFriend);

    setName(``);
    setImage(`https://i.pravatar.cc/48`);
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormUpdateBalance({ selectedFriend, onUpdateBalance }) {
  const [youGave, setYouGave] = useState(0);
  const [friendGave, setFriendGave] = useState(0);

  function handleSubmit(e) {
    e.preventDefault();

    const updatedBalance =
      selectedFriend.balance + Number(youGave || 0) - Number(friendGave || 0);

    onUpdateBalance(selectedFriend.id, updatedBalance);

    setYouGave(0);
    setFriendGave(0);
  }

  return (
    <form className="form-update-balance" onSubmit={handleSubmit}>
      <h2>Update balance with {selectedFriend.name}</h2>

      <label>You gave to {selectedFriend.name}</label>
      <input
        type="number"
        value={youGave}
        onChange={(e) => setYouGave(e.target.value)}
      />

      <label>{selectedFriend.name} gave to you</label>
      <input
        type="number"
        value={friendGave}
        onChange={(e) => setFriendGave(e.target.value)}
      />

      <Button type="submit">Update</Button>
    </form>
  );
}
