package com.techbeyond.calibraapi.config;

import com.techbeyond.calibraapi.entity.Product;
import com.techbeyond.calibraapi.entity.ProductCategory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {
    private final EntityManager entityManager;

    public MyDataRestConfig(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

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

        exposeIds(config);
    }

    private void exposeIds(RepositoryRestConfiguration config) {

        // - get a list of all entity classes from the entity manager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        // - create an array of entity types
        List<Class> entityClasses = new ArrayList<>();
        for (EntityType entityType : entities) {
            entityClasses.add(entityType.getJavaType());
        }
//- expose the entity ids for the array of entity/domain types
        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);

    }
}
