const { cloudinary } = require('../cloudinary');
const Campground = require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken: mapBoxToken})
 
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}


module.exports.createCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query : req.body.campground.location,
        limit : 1
    }).send()
    const newCamp = new Campground(req.body.campground)
    newCamp.geometry = geoData.body.features[0].geometry
    newCamp.images = req.files.map( f => ({url : f.path , filename : f.filename}))
    newCamp.author = req.user._id
    await newCamp.save();
    console.log(newCamp)
    req.flash('success', 'Succesfully made a new campground')
    res.redirect(`/campgrounds/${newCamp._id}`)
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: { path: 'author' }
    })
        .populate('author')
    if (!campground) {
        req.flash('error', 'cannot find the campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'cannot find the campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground)
    const img = req.files.map( f => ({url : f.path , filename : f.filename}))
    campground.images.push(...img);
    await campground.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull : { images : {filename : { $in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Succesfully updated campground')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampgound = async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'successfully deleted campground')
    res.redirect('/campgrounds')
}