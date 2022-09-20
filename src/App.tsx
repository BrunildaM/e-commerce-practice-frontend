import { useEffect, useState } from "react";
import "./App.css";

type Order = {
  id: number;
  quantity: number;
  item: Item;
  itemId: number;
  user: User;
  userId: number;
};

type Item = {
  id: number;
  title: string;
  image: string;
  price: number;
};

type User = {
  id: number;
  name: string;
  email: string;
  orders: Order[];
};

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`http://localhost:5000/users/enkeled@email.com`)
      .then((res) => res.json())
      .then((userFromDb) => setUser(userFromDb));
  }, []);

  if (user === null) return <p>Loading...</p>;

  let total = 0;
  for (const order of user.orders) {
    total += order.quantity * order.item.price;
  }

  function deleteOrder(id: number) {
    if (user === null) return;

    fetch(`http://localhost:5000/orders/${id}`, {
      method: "DELETE",
    });
      // .then((res) => res.json())
      // .then((data) => {
      //   if (data.error) return;

        const userCopy = JSON.parse(JSON.stringify(user))
       let updatedOrder =  userCopy.orders.filter((order: Order) => order.id !== id)
        setUser(updatedOrder)

        // setUser(data);
      };

  return (
    <div className="App">
      <h1>Hello {user.name}!</h1>
      <h2>Here are your orders: </h2>
      <ul>
        {user.orders.map((order) => (
          <div className="order-section" key={order.id}>
            <img
              className="image-section"
              src={order.item.image}
              alt={order.item.title}
            />
            <div className="order-details">
              <li>{order.item.title} </li>
              <li>
                {order.item.price}$ ( X {order.quantity})
              </li>
              <button onClick={() => deleteOrder(order.id)}>X</button>
            </div>
          </div>
        ))}
      </ul>
      <h3>Total price: {total.toFixed(2)}$</h3>
    </div>
  );
}

export default App;
