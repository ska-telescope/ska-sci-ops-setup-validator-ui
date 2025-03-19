#!/bin/env bash

################################################################################
# Setup
################################################################################

if [ -z "$ENV_SEPARATOR" ]; then
    ENV_SEPARATOR=':'
fi
if [ -z "$ENV_TYPE_FILE" ]; then
    ENV_TYPE_FILE='/env_config'
fi
if [ -z "$ENV_JS_OUTPUT_LOCATION" ]; then
    ENV_JS_OUTPUT_LOCATION='/usr/share/nginx/html/env.js'
fi

################################################################################
# End Setup
################################################################################

get_type_default()
{
    if [[ "$1" == "string" ]]; then
        echo ''
    elif [[ "$1" == "number" ]]; then
        echo '0'
    elif [[ "$1" == "boolean" ]]; then
        echo 'false' # quote false to avoid the builtin running
    else
        echo ''
    fi
}

output_js_line()
{
    # add explicit quoting if we are a string,
    if [[ "$1" == "string" ]]; then
        echo -n "  $2: '$3'"
    else
        echo -n "  $2: $3"
    fi
}

create_env_js()
{
    echo "Creating JS file, $ENV_TYPE_FILE -> $ENV_JS_OUTPUT_LOCATION"
    {
        echo 'window.env = {'
        count=0

        # read each line of the input file
        cat "$ENV_TYPE_FILE" | grep -v '^#' | grep -v '^$' | while read -r line; do

            # Get expected name, and type
            var="$(echo "$line" | cut -d "$ENV_SEPARATOR" -f1)"
            type="$(echo "$line" | cut -d "$ENV_SEPARATOR" -f2)"
            default="$(echo "$line" | cut -d "$ENV_SEPARATOR" -f3-)"

            if [[ -z "$default" ]]; then
                # Get default values
                default="$(get_type_default "$type")"
            fi

            # Check if the variable name stored in `var` exists and isn't blank
            # if it exists and isn't blank use it
            # otherwise use the value in the `default` variable
            val="${!var:-$default}"

            # if we are after the first line, add a comma, and new line
            if [[ count -gt 0 ]]; then
                echo ','
            fi

            output_js_line "$type" "$var" "$val"

            count=$((count+1))
        done

        echo -e "\n}"
    } > "$ENV_JS_OUTPUT_LOCATION"
}


create_env_ts()
{
    echo "Creating TS file, $ENV_TYPE_FILE -> $ENV_JS_OUTPUT_LOCATION"
    {
        cat - <<EOF
/* eslint-disable @typescript-eslint/no-explicit-any */

/* DON'T EDIT THIS FILE DIRECTLY

Run: "make dev-local-env" to update it
*/

declare global {
  interface Window {
    env: any;
  }
}

type EnvType = {
EOF

        # read each line of the input file
        cat "$ENV_TYPE_FILE" | grep -v '^#' | grep -v '^$' | while read -r line; do

            # Get expected name, and type
            var="$(echo "$line" | cut -d "$ENV_SEPARATOR" -f1)"
            type="$(echo "$line" | cut -d "$ENV_SEPARATOR" -f2)"
            default="$(echo "$line" | cut -d "$ENV_SEPARATOR" -f3-)"
            echo "  $var: $type;"
        done

        cat - <<EOF
};
export const env: EnvType = {
  ...process.env,
  ...window.env,
  ...(typeof Cypress !== 'undefined' ? Cypress.env() : {})
};
EOF
    } > "$ENV_JS_OUTPUT_LOCATION"
}

run_get_vault()
{
    if [ -f /vault/secrets/config ]; then
        echo "Using vault config"
        source /vault/secrets/config
    else
        echo "No vault secrets found, skipping loading"
    fi
}

run_create_env()
{
    if [ -f "$ENV_TYPE_FILE" ]; then
        create_env_js
        echo "ENV added to $ENV_JS_OUTPUT_LOCATION"
    else
        echo "No Setup Required, missing '$ENV_TYPE_FILE'"
    fi

}

run_get_local_env()
{
    if [ -f ".env" ]; then
        echo "Using local .env config"
        source .env
    else
        echo "No local .env config found, skipping loading"
    fi
}


run_get_local_env
run_get_vault

option_req=${1:-js}

case $option_req in
    js) create_env_js ;;
    ts) create_env_ts ;;
    *) create_env_js ;;
esac