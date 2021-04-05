import React from 'react';
import {Link} from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import Image1 from '../images/Image1.png';
import Image2 from '../images/Image2.png';
import Image3 from '../images/Image3.png';


const Info = () => {
         const isDesktopOrLaptop = useMediaQuery({
            query: '(min-device-width: 700px)'
        })

        return (
            <div >
                <div id="carouselExampleIndicators" className="carousel slide mb-5" data-ride="carousel">
                    <ol className="carousel-indicators">
                        <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                        <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                        <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                    </ol>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img className="d-block w-100" src={Image1} alt="First slide" />
                            <div class="carousel-caption ">
                                <h3>What is Evento?</h3>
                                {isDesktopOrLaptop ?
                                (
                                    <h5>Evento is a new and upcoming Social Network Platform that focuses solely on Event Management.</h5>

                                )
                                :
                                (
                                    <p>Evento is a new and upcoming Social Network Platform that focuses solely on Event Management.</p>

                                )
                                }
                            </div>
                        </div>

                        <div className="carousel-item">
                            <img className="d-block w-100" src={Image2} alt="Second slide" />
                            <div class="carousel-caption">
                                <h3 className="text-dark">Main Feature</h3>
                                {isDesktopOrLaptop ?
                                (
                                    <h5 className="text-dark">Evento allows for organizing and managing Events with utmost ease. We have a very easy to use Interface that allows for interaction and personalized user experience with our User Recommendation System.</h5>

                                )
                                :
                                (
                                    <p className="text-dark">Evento allows for organizing and managing Events with utmost ease. We have a very easy to use Interface that allows for interaction and personalized user experience with our User Recommendation System.</p>
                                )
                                }
                            </div>
                        </div>

                        <div className="carousel-item">
                            <Link to="/signup">
                                <img className="d-block w-100" src={Image3} alt="Third slide" />
                                <div class="carousel-caption ">
                                    <h3>Get Started</h3>
                                    {isDesktopOrLaptop ?
                                (
                                    <h5>Get Started with Evento and you can host and attend events in no time. Click the image to Register Now!</h5>

                                )
                                :
                                (
                                    <p>Get Started with Evento and you can host and attend events in no time. Click the image to Register Now!</p>
                                )
                                }
                                </div>
                            </Link>
                            
                        </div>
                    </div>
                    <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </div>
            </div>
        )
}

export default Info;