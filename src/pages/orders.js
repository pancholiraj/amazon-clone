import Header from "../components/Header";
import { getSession, useSession } from "next-auth/react";
import moment from "moment";
import Order from "../components/Order";
import db from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  getFirestore,
  collectionGroup,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { useEffect } from "react";

const Orders = ({ orders }) => {
  const { data: session } = useSession();

  // useEffect(async () => {
  //   const querySnapshot = await getDocs(collectionGroup(db, "orders"));
  //   querySnapshot.forEach((doc) => {
  //     // doc.data() is never undefined for query doc snapshots
  //     console.log(doc.id, " => ", doc.data());
  //   });
  //   // console.log("done", querySnapshot);

  //   // const querySnapshot = await getDocs(collection(db, "orders"));
  //   // querySnapshot.forEach((doc) => {
  //       //   // doc.data() is never undefined for query doc snapshots
  //       //   console.log(doc.id, " => ", doc.data());
  //       // });
  //       */
  //   //    const colRef = collection(db, "users");
  //   // getDocs(colRef).then((snapshot) => {
  //   //   //   console.log(snapshot.docs);
  //   //   let users = [];
  //   //   snapshot.docs.forEach((doc) => {
  //   //     users.push({ ...doc.data() });
  //   //   });
  //   //   console.log(users);
  //   // });
  //   // console.log(allPosts);
  // }, []);

  return (
    <div>
      <Header />
      <main className="max-w-screen-lg mx-auto p-10">
        <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">
          Your Orders
        </h1>
        {session ? (
          <h2>{orders.length} Orders</h2>
        ) : (
          <h2>Please sign in to see your orders</h2>
        )}
        <div className="mt-5 space-y-4">
          {orders?.map(
            ({ id, amount, amountShipping, items, timestamp, images }) => (
              <Order
                key={id}
                id={id}
                amount={amount}
                amountShipping={amountShipping}
                items={items}
                timestamp={timestamp}
                images={images}
              />
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default Orders;

export async function getServerSideProps(context) {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  // get user logged in credentials...
  const session = await getSession(context);

  if (!session) {
    return {
      props: {},
    };
  }
  const stripeOrders = await getDocs(collectionGroup(db, "orders"));
  stripeOrders.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
  });
  // console.log(stripeOrders);
  // console.log(order);

  const orders = await Promise.all(
    stripeOrders.docs.map(async (order) => ({
      id: order.id,
      amount: order.data().amount,
      amountShipping: order.data().amount_shipping,
      images: order.data().images,
      timestamp: moment(order.data().timestamp.toDate()).unix(),
      items: (
        await stripe.checkout.sessions.listLineItems(order.id, {
          limit: 100,
        })
      ).data,
    }))
  );

  // const orders = await Promise.all(
  //   (
  //     await stripeOrders
  //   ).map((order) => ({
  //     // console.log(order);
  //     id: 1,
  //     amount: order.amount,
  //     amountShipping: order.amount_shipping,
  //     images: order.images,
  //     // timestamp: order.timestamp,
  //   }))
  // );
  return {
    props: {
      orders,
    },
  };
}
