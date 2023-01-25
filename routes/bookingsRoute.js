const express = require("express");
const router = express.Router();
const Booking = require("../Models/booking");
const Room = require("../Models/room");
//use uuid unique id for transaction
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51MH5dvSJnjKaNcHxn4B4SD7qeoBwfqXOls3vW1hnBOHgC7lJ7qTmFbpBrbCmGntTwHBHvX8hxbKgM2oXM98bVAQa00R5p6sP67"
);

router.post("/bookroom", async (req, res) => {
  const { room, userid, fromdate, todate, totalamount, totaldays, token } =
    req.body;

  console.log("REQUEST", req.body);
  try {
    const customer = await stripe.customers.create({
      email: token.email,
      // source: token.id
    });

    console.log("customer", customer);

    const payment = await stripe.invoiceItems.create({
      amount: totalamount * 100,
      customer: customer.id,
      currency: "PKR",
      description: "One-time setup fee",
    });
    console.log("payment", payment);

    if (payment) {
      const newbooking = new Booking({
        room: room.name,
        roomid: room._id,
        userid,
        fromdate,
        todate,
        totalamount,
        totaldays,
        transactionId: "1234",
      });

      const booking = await newbooking.save();

      const roomtemp = await Room.findOne({ _id: room._id });

      roomtemp.currentbookings.push({
        bookingid: booking._id,
        fromdate: fromdate,
        todate: todate,
        userid: userid,
        status: booking.status,
      });

      await roomtemp.save();
    }

    res.send("Payment Successfull , Your Room is booked");
  } catch (error) {
    return res.status(400).json({ error });
  }

  // Paste this condition in stripe logic

  // try {
  //   const newbooking = new Booking({
  //     room: room.name,
  //     roomid: room._id,
  //     userid,
  //     fromdate,
  //     todate,
  //     totalamount,
  //     totaldays,
  //     transactionId: "1234",
  //   });

  //   const booking = await newbooking.save();

  //   const roomtemp = await Room.findOne({ _id: room._id });

  //   roomtemp.currentbookings.push({
  //     bookingid: booking._id,
  //     fromdate: fromdate,
  //     todate: todate,
  //     userid: userid,
  //     status: booking.status,
  //   });

  //   await roomtemp.save()

  //   res.send("Room booked successfully");
  // } catch (error) {
  //   return res.status(400).json({ error });
  // }
});

router.post("/getbookingsbyuserid", async (req, res) => {
  const userid = req.body.userid;
  try {
    const bookings = await Booking.find({ userid: userid });
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ error });
  }    
});

router.post("/cancelbooking", async (req, res) => {
  const { bookingid, roomid } = req.body;
  try {
    const bookingitem = await Booking.findOne({ _id: bookingid });

    bookingitem.status = "cancelled";
    // console.log("ia m hererer1")

    await bookingitem.save();
    // console.log("ia m hererer2")
    const room = await Room.findOne({ _id: roomid });
    // console.log("ia m hererer3",roomid)
    const bookings = room.currentbookings;
    // console.log("ia m hererer4",bookings)
    // console.log("ia m hererer4.5",bookingid)

    const temp = bookings.filter(
      (booking) => booking.bookingid !== `new ObjectId("${bookingid}")`
    );
    // console.log("ia m hererer5")
    room.currentbookings = temp;
    // console.log("ia m hererer6",temp)
    await room.save();
    // console.log("ia m hererer7")
    res.send("Your booking cancelled successfully");
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/getallbookings" , async(req , res) => {
  try {
    const bookings = await Booking.find()
    res.send(bookings)
  } catch (error) {
    return res.status(400).json({error});
  }
});

module.exports = router;
