package com.techbeyond.calibraapi.config;

import com.techbeyond.calibraapi.entity.Country;
import com.techbeyond.calibraapi.entity.Product;
import com.techbeyond.calibraapi.entity.ProductCategory;
import com.techbeyond.calibraapi.entity.State;
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

    //disable HTTP methods for ProductCategory: POST, PUT, DELETE
    private static void disableHttpMethod(Class domainClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedAction) {

        config.getExposureConfiguration().forDomainType(domainClass)
                .withItemExposure(((metdata, httpMethods) -> httpMethods.disable(theUnsupportedAction)))
                .withAssociationExposure(((metdata, httpMethods) -> httpMethods.disable(theUnsupportedAction)));
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        RepositoryRestConfigurer.super.configureRepositoryRestConfiguration(config, cors);
        HttpMethod[] theUnsupportedAction = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};

        //disable HTTP methods for ProductCategory: POST, PUT, DELETE
        disableHttpMethod(Product.class, config, theUnsupportedAction);
        disableHttpMethod(ProductCategory.class, config, theUnsupportedAction);
        disableHttpMethod(Country.class, config, theUnsupportedAction);
        disableHttpMethod(State.class, config, theUnsupportedAction);

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
