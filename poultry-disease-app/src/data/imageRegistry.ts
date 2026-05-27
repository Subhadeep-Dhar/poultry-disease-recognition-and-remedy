// Central registry mapping image file refs to require() calls.
// React Native requires static require() — no dynamic paths allowed.
// Add each new image here as a new entry.

export const DISEASE_GALLERY_IMAGES: Record<string, number[]> = {
    ranikhet: [
        // Clinical Symptoms
        require('../../assets/disease_images/ranikhet/clinical_symptoms/comb_cyanosis/ranikhet_blue_comb_cyanosis_01.png'),
        require('../../assets/disease_images/ranikhet/clinical_symptoms/comb_necrosis/ranikhet_comb_necrosis_01.png'),
        require('../../assets/disease_images/ranikhet/clinical_symptoms/face_swelling/ranikhet_face_swelling_01.png'),
        require('../../assets/disease_images/ranikhet/clinical_symptoms/head_rotation/ranikhet_head_backward_rotation_01.png'),
        require('../../assets/disease_images/ranikhet/clinical_symptoms/leg_paralysis/ranikhet_leg_paralysis_01.png'),
        require('../../assets/disease_images/ranikhet/clinical_symptoms/neck_twist/ranikhet_twisted_neck_01.png'),
        require('../../assets/disease_images/ranikhet/clinical_symptoms/neck_twist/ranikhet_twisted_neck_02.png'),
        require('../../assets/disease_images/ranikhet/clinical_symptoms/stool/ranikhet_green_white_mucous_stool_01.png'),
        require('../../assets/disease_images/ranikhet/clinical_symptoms/wing_drooping/ranikhet_wing_drooping_01.png'),

        // Postmortem Lesions
        require('../../assets/disease_images/ranikhet/postmortem_lesions/cecal_tonsils/ranikhet_cecal_tonsil_necrotic_tonsillitis_01.png'),
        require('../../assets/disease_images/ranikhet/postmortem_lesions/cecum/ranikhet_cecum_hemorrhage_01.jpeg'),
        require('../../assets/disease_images/ranikhet/postmortem_lesions/esophagus_proventriculus_boundary/ranikhet_esophagus_proventriculus_boundary_hemorrhage_01.png'),
        require('../../assets/disease_images/ranikhet/postmortem_lesions/intestinal_catarrhal_inflammation/ranikhet_catarrhal_intestinal_inflammation_01.png'),
        require('../../assets/disease_images/ranikhet/postmortem_lesions/intestinal_plaques/ranikhet_intestinal_diphtheritic_plaques_01.png'),
        require('../../assets/disease_images/ranikhet/postmortem_lesions/intestine/ranikhet_intestinal_lesion_hemorrhage_05.jpeg'),
        require('../../assets/disease_images/ranikhet/postmortem_lesions/intestine/ranikhet_small_intestine_pinpoint_hemorrhage_01.png'),
        require('../../assets/disease_images/ranikhet/postmortem_lesions/intestine/ranikhet_small_intestine_pinpoint_hemorrhage_02.png'),
        require('../../assets/disease_images/ranikhet/postmortem_lesions/intestine/ranikhet_small_intestine_pinpoint_hemorrhage_03.png'),
        require('../../assets/disease_images/ranikhet/postmortem_lesions/intestine/ranikhet_small_intestine_pinpoint_hemorrhage_04.png'),
        require('../../assets/disease_images/ranikhet/postmortem_lesions/mortality_pattern/ranikhet_high_mortality_pattern_01.png'),
        require('../../assets/disease_images/ranikhet/postmortem_lesions/oral_nasopharynx/ranikhet_oral_nasopharynx_inflammation_01.png'),
        require('../../assets/disease_images/ranikhet/postmortem_lesions/proventriculus/ranikhet_proventriculus_blood_spots_03.jpeg'),
        require('../../assets/disease_images/ranikhet/postmortem_lesions/proventriculus/ranikhet_proventriculus_hemorrhage_04.png.jpg'),
        require('../../assets/disease_images/ranikhet/postmortem_lesions/proventriculus/ranikhet_proventriculus_pinpoint_hemorrhage_01.png'),
        require('../../assets/disease_images/ranikhet/postmortem_lesions/proventriculus/ranikhet_proventriculus_pinpoint_hemorrhage_02.png'),
        require('../../assets/disease_images/ranikhet/postmortem_lesions/proventriculus/ranikhet_proventriculus_pinpoint_hemorrhage_03.png'),
        require('../../assets/disease_images/ranikhet/postmortem_lesions/proventriculus_gizzard_boundary/ranikhet_proventriculus_gizzard_boundary_hemorrhage_01.png'),
        require('../../assets/disease_images/ranikhet/postmortem_lesions/stomach_mucosa/ranikhet_stomach_mucosa_fibrin_deposit_01.png'),
        require('../../assets/disease_images/ranikhet/postmortem_lesions/trachea/ranikhet_trachea_severe_hemorrhage_01.png'),

    ],
};

/**
 * Get all gallery images for a disease by its id.
 * Returns an empty array if the disease has no registered images.
 */
export function getGalleryImages(diseaseId: string): number[] {
    return DISEASE_GALLERY_IMAGES[diseaseId] ?? [];
}