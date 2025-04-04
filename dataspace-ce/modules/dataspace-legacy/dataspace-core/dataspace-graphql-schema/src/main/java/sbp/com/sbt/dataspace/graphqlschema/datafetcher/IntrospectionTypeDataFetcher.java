package sbp.com.sbt.dataspace.graphqlschema.datafetcher;

import graphql.GraphQLError;
import graphql.GraphqlErrorException;
import graphql.schema.DataFetchingEnvironment;
import org.jetbrains.annotations.NotNull;
import ru.sbertech.dataspace.security.graphql.SecurityRulesFetcher;
import ru.sbertech.dataspace.security.utils.GraphQLSecurityContext;
import sbp.com.sbt.dataspace.graphqlschema.GraphQLDataFetcherHelper;

import java.util.ArrayList;
import java.util.List;

import static graphql.execution.DataFetcherResult.newResult;
import static graphql.introspection.Introspection.TypeMetaFieldDefDataFetcher;

/**
 * Data loader for type introspection
 * Redefine the default wrapper as well because it also needs to fall under GQL security
 */
public class IntrospectionTypeDataFetcher extends BaseIntrospectionDataFetcher {

    /**
     * @param graphQLDataFetcherHelper Helper for GraphQL data loader
     */
    public IntrospectionTypeDataFetcher(GraphQLDataFetcherHelper graphQLDataFetcherHelper,
                                        SecurityRulesFetcher securityRulesFetcher,
                                        String introspectionCheckCondition) {
        super(graphQLDataFetcherHelper, securityRulesFetcher, introspectionCheckCondition);
    }

    @Override
    public @NotNull Object get(@NotNull DataFetchingEnvironment environment, GraphQLSecurityContext securityContext) {
        List<GraphQLError> errors = new ArrayList<>();
        Object data = null;
        try {
            data = TypeMetaFieldDefDataFetcher.get(environment);
        } catch (Exception e) {
            // Impossible?
            errors.add(GraphqlErrorException.newErrorException()
                    .message("Inspection type error")
                    .cause(e)
                    .build()
            );
        }
        return newResult()
                .data(data)
                .errors(errors)
                .build();
    }
}
