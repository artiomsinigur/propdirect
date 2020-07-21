const validateProperty = (error) => {
    try {
        const errors = [];
        const { title, price, type, description, street, postalCode, bedroom, bathroom, yearConstruction } = error.errors;

        // Validate title
        if (title) { errors.push(title.message) }
    
        // Validate price
        if (price) { errors.push(price.message) }
    
        // Validate description
        if (type) { errors.push(type.message) }
    
        // Validate description
        if (description) { errors.push(description.message) }
    
        // Validate street
        if (street) { errors.push(street.message) }
    
        // Validate postalCode
        if (postalCode) { errors.push(postalCode.message) }
    
        // Validate bedroom
        if (bedroom) { errors.push(bedroom.message) }
    
        // Validate bathroom
        if (bathroom) { errors.push(bathroom.message) }
    
        // Validate yearConstruction
        if (yearConstruction) { errors.push(yearConstruction.message) }
        
        return errors;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = validateProperty;