var QueryFilter = {
    
    add: function( name , value ){
        return  PIE.ol.format.filter.and( name , value );
    },

    like: function( name , value ){
        return  PIE.ol.format.filter.like( name , value );
    },

    equalTo: function( name , value ){
        return  PIE.ol.format.filter.equalTo( name , value );
    },

    intersects: function( name , value ){
        return  PIE.ol.format.filter.intersects( name , value );
    },
    
};
export {QueryFilter}