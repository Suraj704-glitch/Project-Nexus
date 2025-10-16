const samplelistings = [
  {
    title: "Minimalist Studio",
    description: "Walking distance to restaurants",
    image:{
     url:"https://images.pexels.com/photos/8097202/pexels-photo-8097202.jpeg",
     filename:"listingimage",
    },
     price: 9883,
    location: "Udaipur",
    country: "Nepal"
  },
  {
    title: "Modern City Apartment",
    description: "A serene escape from the city",
    image:{
     url: "https://images.unsplash.com/photo-1760021268926-128d69fa4761?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fm=jpg&q=60&w=3000",
     filename:"listingimage",
    },
    
    price: 9815,
    location: "Udaipur",
    country: "Thailand"
  },
  {
    title: "Secluded Jungle Retreat",
    description: "Perfect for a weekend getaway",
    image:{
     url:"https://images.pexels.com/photos/13134819/pexels-photo-13134819.jpeg",
     filename:"listingimage",
    }, 
    price: 5337,
    location: "Agra",
    country: "Bhutan"
  },
  {
    title: "Cozy Beachfront Villa",
    description: "Pet-friendly stay",
    image:{
     url: "https://media.istockphoto.com/id/1154542428/photo/modern-apartment-buildings-on-a-sunny-day-with-a-blue-sky.jpg?s=1024x1024&w=is&k=20&c=OB2asKNI0MmKv5CL-Yj6jTJx6HJkW8dVqFB_SaeYgCM=",
     filename:"listingimage",
    }, 
    price: 938,
    location: "Udaipur",
    country: "India"
  },
  {
    title: "Cozy Beachfront Villa",
    description: "Perfect for a weekend getaway",
    image:{
     url:"https://images.pexels.com/photos/28843941/pexels-photo-28843941.jpeg",
     filename:"listingimage",
    }, 
    price: 2849,
    location: "Manali",
    country: "India"
  },
  {
    title: "Luxury Penthouse",
    description: "Close to local attractions",
    image:{
     url:"https://images.pexels.com/photos/20111727/pexels-photo-20111727.jpeg",
     filename:"listingimage",
    }, 
    price: 7012,
    location: "Goa",
    country: "Nepal"
  },
  {
    title: "Urban Loft",
    description: "Ideal for families",
    image:{
     url:"https://images.pexels.com/photos/5824526/pexels-photo-5824526.jpeg",
     filename:"listingimage",
    }, 
    price: 4358,
    location: "Rishikesh",
    country: "India"
  },
  {
    title:"Charming Countryside Cottage",
    description: "Pet-friendly stay",
    image:{
     url: "https://media.istockphoto.com/id/1408230637/photo/unrecognizable-couple-arriving-at-the-accommodation-with-their-suitcases.jpg?s=1024x1024&w=is&k=20&c=pi0C5pUzrHmfK72kFrYCuAYXsWzE2fCL7WuD32ncX50=",
     filename:"listingimage",
    }, 
    price: 1476,
    location: "Kerala",
    country: "Bhutan"
  },
  {
    title: "Rustic Mountain Cabin",
    description: "Breathtaking views",
    image:{
     url:"https://images.pexels.com/photos/5480716/pexels-photo-5480716.jpeg",
     filename:"listingimage",
    }, 
    price: 3675,
    location: "Shimla",
    country: "India"
  },
  {
    title: "Secluded Jungle Retreat",
    description: "Romantic retreat",
    image:{
     url:"https://images.pexels.com/photos/13134819/pexels-photo-13134819.jpeg",
     filename:"listingimage",
    }, 
    price: 5233,
    location: "Darjeeling",
    country: "Nepal"
  },
  {
    title: "Cozy Beachfront Villa",
    description: "A serene escape from the city",
    image:{
     url:"https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg",
     filename:"listingimage",
    }, 
    price: 7592,
    location: "Goa",
    country: "India"
  },
  {
    title: "Modern City Apartment",
    description: "Perfect for a weekend getaway",
    image:{
     url:"https://images.unsplash.com/photo-1653151106419-b91300e4be19?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fm=jpg&q=60&w=3000",
     filename:"listingimage",
    },  
    price: 6311,
    location: "sri lunka",
    country: "Sri Lanka"
  },
  {
    title: "Rustic Mountain Cabin",
    description: "Walking distance to restaurants",
    image:{
     url:"https://images.unsplash.com/photo-1621788549737-49fe7172aab5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fm=jpg&q=60&w=3000",
     filename:"listingimage",
    }, 
    price: 2874,
    location: "Jaipur",
    country: "India"
  },
  {
    title: "Minimalist Studio",
    description: "High-speed internet included",
    image:{
     url:"https://images.unsplash.com/photo-1663211656005-2ece5e1c346a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fm=jpg&q=60&w=3000",
     filename:"listingimage",
    }, 
    price: 8152,
    location: "Manali",
    country: "Nepal"
  },
  {
    title: "Luxury Penthouse",
    description: "Ideal for families",
    image:{
     url:"https://images.pexels.com/photos/7031712/pexels-photo-7031712.jpeg",
     filename:"listingimage",
    }, 
    price: 9124,
    location: "Mysore",
    country: "India"
  },
  {
    title: "Charming Countryside Cottage",
    description: "Romantic retreat",
    image:{
     url:"https://images.pexels.com/photos/14280807/pexels-photo-14280807.jpeg",
     filename:"listingimage",
    }, 
    price: 2047,
    location: "Rishikesh",
    country: "Bhutan"
  },
  {
    title: "Historic Downtown Flat",
    description: "Pet-friendly stay",
    image:{
     url:"https://media.istockphoto.com/id/639448110/photo/women-outdoors.jpg?s=1024x1024&w=is&k=20&c=NJ4zCsVT8CZ4qSY9VAHF1Kw80u5qiLGwfgmbej2Cb0s=",
     filename:"listingimage",
    }, 
    price: 5592,
    location: "Darjeeling",
    country: "Sri Lanka"
  },
  {
    title: "Elegant Lake House",
    description: "Breathtaking views",
    image:{
     url:"https://images.pexels.com/photos/6527068/pexels-photo-6527068.jpeg",
     filename:"listingimage",
    },  
    price: 6235,
    location: "Udaipur",
    country: "India"
  },
  {
    title: "Rustic Mountain Cabin",
    description: "High-speed internet included",
    image:{
     url:"https://images.pexels.com/photos/33930078/pexels-photo-33930078.jpeg",
     filename:"listingimage",
    },
    price: 4785,
    location: "Shimla",
    country: "Nepal"
  },
  {
  title: "Seaside Beach Hut",
  description: "Relax by the ocean waves",
  image:{
   url:"https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
   filename:"listingimage",
  }, 
  price: 4250,
  location: "Goa",
  country: "India"
},
{
  title: "Urban Loft Apartment",
  description: "Modern comfort in the city center",
  image:{
   url:"https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
   filename:"listingimage",
  }, 
  price: 5600,
  location: "Bangalore",
  country: "India"
},
{
  title: "Desert Safari Camp",
  description: "Experience the golden dunes",
  image:{
   url:"https://media.istockphoto.com/id/1490603610/photo/get-comfy-for-studying.jpg?s=612x612&w=0&k=20&c=Uj0u9qzoyvuIgHHkbR3VgTTBVRfA3ZUbQoDYGd0CZJ8=",
   filename:"listingimage",
  }, 
  price: 2900,
  location: "lucknow",
  country: "India"
},
{
  title: "Forest Treehouse",
  description: "Reconnect with nature high above the ground",
  image:{
   url:"https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
   filename:"listingimage",
  }, 
  price: 4800,
  location: "kanpur",
  country: "India"
},
{
  title: "Lakeview Cottage",
  description: "Peaceful stay with a stunning lake view",
  image:{
   url:"https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
   filename:"listingimage",
  }, 
  price: 3750,
  location: "lucknow",
  country: "India"
},
{
  title: "Himalayan Retreat",
  description: "Snow-capped peaks and cozy interiors",
  image:{
   url:"https://media.istockphoto.com/id/1156480842/photo/a-young-female-student-sitting-on-sofa-using-laptop-when-studying.webp?a=1&b=1&s=612x612&w=0&k=20&c=ef9oDDGMj9RvhBG4YORVVF78_27TAlGvAtkCWnmemDs=",
   filename:"listingimage",
  }, 
  price: 6500,
  location: "kanpur",
  country: "India"
},
{
  title: "Backwater Houseboat",
  description: "Sail through serene waters",
  image:{
   url:"https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
   filename:"listingimage",
  }, 
  price: 5400,
  location: "goa",
  country: "India"
},
{
  title: "Colonial Hill Bungalow",
  description: "Old-world charm with mountain air",
  image:{
   url:"https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
   filename:"listingimage",
  }, 
  price: 4600,
  location: "basti",
  country: "India"
},
{
  title: "Tropical Jungle Cabin",
  description: "Adventure in the wild green heart",
  image:{
   url:"https://media.istockphoto.com/id/670900812/photo/excited-children-arriving-home-with-parents.jpg?s=1024x1024&w=is&k=20&c=hlLF3svPJ3Yo_7mZcFOvuHD_855STYfYqppSmp78o54=",
   filename:"listingimage",
  }, 
  price: 3200,
  location: "lucknow",
  country: "India"
},
{
  title: "Snow Valley Chalet",
  description: "Warm fireplace with a view of white slopes",
  image:{
   url:"https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg",
   filename:"listingimage",
  }, 
  price: 7200,
  location: "kanpur",
  country: "India"
}

  // ... continue exactly the same format until all 50 objects are included
];

module.exports={data:samplelistings}; // export in the from of Object :