import Booking from "./booking";
export default function App() {

  const layout = {
    info: { title: "Awesome Movie Hall", subtitle: "Select your preferred seats" },
    rows: 8,
    seatsPerRow: 12,
    aislePositions: [5],
    currency: "INR",
    bookedSeats: [],
    onBookingComplete: (ids = []) => { },

    seatTypes: [
      { id: "regular", name: "Regular", price: 150, rows: [0, 1, 2], color: "#D8EBFE" },
      { id: "premium", name: "Premium", price: 250, rows: [3, 4, 5], color: "#F5E9FE" },
      { id: "vip", name: "VIP", price: 350, rows: [6, 7], color: "#FDFAC6" },
    ],
  };

  return (
    <>
      <Booking data={layout} />
    </>
  )
}
