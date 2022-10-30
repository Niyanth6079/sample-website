const mongoose = require('mongoose')
const campground = require('../models/campground')
const cities = require('./cities')
const { places , descriptors} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log('mongo Connection Open')
    })
    .catch(err => {
        console.log('oh no error mongo connection error')
        console.log(err)
    })

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random50 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20) +10;
        const camp = new campground({
            author : '634fd73f7771da3e230d5e49',
            location: `${cities[random50].city} , ${cities[random50].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            description : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda hic perspiciatis nihil placeat ipsa quibusdam cupiditate delectus aut dolor! Magni suscipit non alias error laboriosam beatae explicabo autem eveniet id?',
            price,
            images : [
                {
                    url: 'https://res.cloudinary.com/dp3443tji/image/upload/v1666802372/YelpCamp/vxkpukm52po9xzcflnk1.jpg',
                    filename: 'YelpCamp/vxkpukm52po9xzcflnk1',
                  },
                  {
                    url: 'https://res.cloudinary.com/dp3443tji/image/upload/v1666802372/YelpCamp/exy5k0tgpsvzxolpnwy4.jpg',
                    filename: 'YelpCamp/exy5k0tgpsvzxolpnwy4',
                  }
            ],
            geometry : { type : 'Point' , coordinates : [cities[random50].longitude,cities[random50].latitude ]}
        })
        await camp.save()
    }

}

seedDB().then(() => {
    mongoose.connection.close();
})