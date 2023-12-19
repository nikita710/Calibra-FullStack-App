package com.techbeyond.calibraapi.config;

import com.techbeyond.calibraapi.entity.Product;
import com.techbeyond.calibraapi.entity.ProductCategory;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        RepositoryRestConfigurer.super.configureRepositoryRestConfiguration(config, cors);
        HttpMethod[] theUnsupportedAction = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};

        //disable HTTP methods for Product: POST, PUT, DELETE
        config.getExposureConfiguration().forDomainType(Product.class)
                .withItemExposure(((metdata, httpMethods) -> httpMethods.disable(theUnsupportedAction)))
                .withAssociationExposure(((metdata, httpMethods) -> httpMethods.disable(theUnsupportedAction)));

        //disable HTTP methods for ProductCategory: POST, PUT, DELETE
        config.getExposureConfiguration().forDomainType(ProductCategory.class)
                .withItemExposure(((metdata, httpMethods) -> httpMethods.disable(theUnsupportedAction)))
                .withAssociationExposure(((metdata, httpMethods) -> httpMethods.disable(theUnsupportedAction)));
    }
}
