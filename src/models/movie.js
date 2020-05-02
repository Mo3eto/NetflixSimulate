const mongoose = require('mongoose')
const movieSchema = new mongoose.Schema({
    id:{
        type: String,
    },
    title:{
        type: String,
    },
    year:{
        type: String,
    },
    length:{
        type: String,
    },
    rating:{
        type: String,
    },
    rating_votes:{
        type: String,
    },
    poster:{
        type: String,
    },
    plot:{
        type: String,
    },
    trailer:{
        id:{
            type: String,
        },
        link:{
            type: String,
        }
    },
    url:{
        type: String,
    },
  
    cast:[{
        actor:{
            type: String,
        },
        actor_id:{
            type: String,
        },
        character:{
            type: String,
        }
    }]


})

const Movie = mongoose.model('Movie', movieSchema)
module.exports = Movie