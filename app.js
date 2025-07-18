const express= require("express");
const app= express();
const mongoose= require("mongoose");
// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const Listing=require("./models/listing");
const path= require("path");
const methodOverride= require("method-override")
const ejsMate= require("ejs-mate")
const MONGO_URL=process.env.MONGO_URL;
const PORT= process.env.PORT || 8000

main().then(()=>{
    console.log("connected to db");
    
}).catch(err=>{
    console.log(err);
    
})

async function main() {
    await mongoose.connect(MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")));
//Index route
app.get("/",async (req,res)=>{
   const allListings=await Listing.find({});
        res.render("listings/index",{allListings})
})



app.get("/listings/new",(req,res)=>{
    res.render("listings/new")
})
// show route
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    res.render("listings/show",{listing})
})

//create route

app.post("/listings",async (req,res)=>{
    // let{title,description,image,location,price,country}=req.body;
    let listing= req.body.listing;
    const newListing=new Listing(listing)
    await newListing.save();
    res.redirect("/listings")
    
})

app.get("/listings/:id/edit",async(req,res)=>{
     let {id}=req.params;
    const listing=await Listing.findById(id)
    res.render("listings/edit",{listing})

})

//Update route

app.put("/listings/:id",async(req,res)=>{
     let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}`)
})

// delete route

app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id)
    console.log(deletedListing);
    res.redirect("/listings")
    
})



// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My Home",
//         description:"dih buchauli",
//         price:78000,
//         location:"DIH BUCHAULI",
//         country: "India",

//     })
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful");
    
// })

app.listen(PORT,()=>{
    console.log("server is listing to the port 8000")
    
})