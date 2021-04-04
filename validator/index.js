exports.createPostValidator = (req, res, next) => {
    // title
    req.check('title', "Write a title").notEmpty();
    req.check('title', "Title must be between 4 and 150 characters").isLength({
        min: 4,
        max:150
    });

    // body
    req.check('body', "Write a body").notEmpty();
    req.check('body', "Body must be between 4 and 2000 characters").isLength({
        min: 4,
        max:2000
    });
    
    // check for other errors
    const errors = req.validationErrors()
    // if error shows the first one as they appear
    if (errors){
        const firstError = errors.map((error) => error.msg)[0]
        return res.status(400).json({error: firstError})
    }

    // proceed to next middleware
    next()
}


exports.userSignupValidator = (req, res, next) => {
    // name is not null and between 3-10 characters
    req.check("name", "Name is required.").notEmpty();

    // email is not null. Should be valid and normalized
    req.check("email", "Email must be between 3 to 32 characters")
    .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)                                              // regex to check if @ is present in string
    .withMessage("Email must contain @")
    .isLength({
        min: 4,
        max: 32
    })

    // check for password
    req.check("password", "Password is required.").notEmpty();
    req.check("password")
    .isLength({
        min: 8
    })
    .withMessage("Password must contain atleast 8 characters")
    .matches(/\d/)                                                      // regex to check if digit is present in string
    .withMessage("Password must contain a digit")
  
    // error check
    // check for other errors
    const errors = req.validationErrors()
    // if error shows the first one as they appear
    if (errors){
        const firstError = errors.map((error) => error.msg)[0]
        return res.status(400).json({error: firstError})
    }

    // proceed to next middleware
    next()
};


exports.passwordResetValidator = (req, res, next) => {
    // check for password
    req.check("newPassword", "Password is required").notEmpty();
    req.check("newPassword")
        .isLength({min: 8})
        .withMessage("Password must be atleast 8 characters long")
        .matches(/\d/)
        .withMessage("Password must contain a number")

    // check for other errors
    const errors = req.validationErrors()
    // if error shows the first one as they appear
    if (errors){
        const firstError = errors.map((error) => error.msg)[0]
        return res.status(400).json({error: firstError})
    }

    // proceed to next middleware
    next();
}