/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { 
    BrandingPreference 
} from "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";
import { FormButtonToolbar, FormField } from "@pet-management-webapp/shared/ui/ui-basic-components";
import {
    SettingsTitleComponent
} from "@pet-management-webapp/shared/ui/ui-components";
import { checkIfJSONisEmpty } from "@pet-management-webapp/shared/util/util-common";
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE } from "@pet-management-webapp/shared/util/util-front-end-util";
import { postPersonalization } from "apps/business-admin-app/APICalls/UpdatePersonalization/post-personalization";
import { Personalization } from "apps/business-admin-app/types/personalization";
import controllerDecodeGetBrandingPreference 
    from "libs/business-admin-app/data-access/data-access-controller/src/lib/controller/branding/controllerDecodeGetBrandingPreference";
import controllerDecodeUpdateBrandingPreference 
    from "libs/business-admin-app/data-access/data-access-controller/src/lib/controller/branding/controllerDecodeUpdateBrandingPreference";
import { Session } from "next-auth";
import React, { useCallback, useEffect, useState } from "react";
import { Form } from "react-final-form";
import { Container, Toaster, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import personalize from "./personalize";
import styles from "../../../../../styles/Settings.module.css";

interface PersonalizationSectionComponentProps {
    session: Session
}

/**
 * 
 * @param prop - session
 * 
 * @returns The personalization interface section.
 */
export default function PersonalizationSectionComponent(props: PersonalizationSectionComponentProps) {

    const { session } = props;

    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);
    const toaster: Toaster = useToaster();

    const [ brandingPreference, setBrandingPreference ] = useState<BrandingPreference>(null);
    const [ logoUrl, setLogoUrl ] = useState<string>("");
    const [ logoAltText, setLogoAltText ] = useState<string>("");
    const [ favicon, setFavicon ] = useState<string>("");
    const [ primaryColor, setPrimaryColor ] = useState<string>("");

    const fetchData = useCallback(async () => {
        fetchBrandingPreference();
    }, [ session ]);

    useEffect(() => {
        fetchData();
        fetchBrandingPreference();
    }, [ fetchData ]);

    const fetchBrandingPreference = async () => {
        const res: BrandingPreference = (await controllerDecodeGetBrandingPreference(session) as BrandingPreference);
        const activeTheme: string = res["preference"]["theme"]["activeTheme"];

        setLogoUrl(res["preference"]["theme"][activeTheme]["images"]["logo"]["imgURL"]);
        setLogoAltText(res["preference"]["theme"][activeTheme]["images"]["logo"]["altText"]);
        setFavicon(res["preference"]["theme"][activeTheme]["images"]["favicon"]["imgURL"]);
        setPrimaryColor(res["preference"]["theme"][activeTheme]["colors"]["primary"]["main"]);

        setBrandingPreference(res);
    };

    const onUpdate = async (values: Record<string, string>, form): Promise<void> => {
        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        const activeTheme: string = brandingPreference["preference"]["theme"]["activeTheme"];

        brandingPreference["preference"]["theme"][activeTheme]["images"]["logo"]["imgURL"] = values["logo_url"];
        brandingPreference["preference"]["theme"][activeTheme]["images"]["logo"]["altText"] = values["logo_alt_text"];
        brandingPreference["preference"]["theme"][activeTheme]["images"]["favicon"]["imgURL"] = values["favicon_url"];
        brandingPreference["preference"]["theme"][activeTheme]["colors"]["primary"]["main"] = values["primary_color"];

        controllerDecodeUpdateBrandingPreference(session, brandingPreference)
            .then(() => {
                const newPersonalization: Personalization = {
                    faviconUrl: values["favicon_url"],
                    logoAltText: values["logo_alt_text"],
                    logoUrl: values["logo_url"],
                    org: session.orgId,
                    primaryColor: values["primary_color"]
                };

                postPersonalization(session.accessToken, session.orgId, newPersonalization)
                    .then(() => {
                        personalize(newPersonalization);
                    })
                    .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
                fetchBrandingPreference();
            })
            .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
        setLoadingDisplay(LOADING_DISPLAY_NONE);
    };

    return (
        <Container>

            <SettingsTitleComponent
                title="Personalization"
                subtitle="Customize the user interfaces of your application."
            />

            <div style={ { margin: "50px" } }>
                <Form
                    onSubmit={ onUpdate }
                    initialValues={{
                        favicon_url: favicon,
                        logo_alt_text: logoAltText,
                        logo_url: logoUrl,
                        primary_color: primaryColor
                    }}
                    render={({ handleSubmit, form, submitting, pristine, errors }) => (
                        <FormSuite
                            layout="vertical"
                            className={ styles.addUserForm }
                            onSubmit={ () => { handleSubmit().then(form.restart); } }
                            fluid>

                            <FormField
                                name="logo_url"
                                label="Logo URL"
                                helperText={
                                    "Use an image that’s at least 600x600 pixels and " +
                                    "less than 1mb in size for better performance."
                                }
                                needErrorMessage={ true }
                            >
                                <FormSuite.Control name="input" value="a" />
                            </FormField>

                            <FormField
                                name="logo_alt_text"
                                label="Logo Alt Text"
                                helperText={
                                    "Add a short description of the logo image to display when " +
                                    "the image does not load and also for SEO and accessibility."
                                }
                                needErrorMessage={ true }
                            >
                                <FormSuite.Control name="input" />
                            </FormField>

                            <FormField
                                name="favicon_url"
                                label="Favicon URL"
                                helperText={
                                    "Use an image with a square aspect ratio that’s " +
                                    "at least 16x16 pixels in size for better results."
                                }
                                needErrorMessage={ true }
                            >
                                <FormSuite.Control name="input" type="url" />
                            </FormField>

                            <FormField
                                name="primary_color"
                                label="Primary Colour"
                                helperText={
                                    "The main color that is shown in primary action buttons, hyperlinks, etc."
                                }
                                needErrorMessage={ true }
                            >
                                <FormSuite.Control name="input" />
                            </FormField>

                            <FormButtonToolbar
                                submitButtonText="Update"
                                submitButtonDisabled={ submitting || pristine || !checkIfJSONisEmpty(errors) }
                                needCancel={ false }
                            />

                        </FormSuite>
                    )}
                />
            </div>
        </Container>
    );

}

