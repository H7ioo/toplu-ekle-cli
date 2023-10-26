import { EMPTY_OPTION } from "../../../lib/variables";

/**
 * @CategoryName Kulak İçi Kablolu Kulaklık > Elektronik > Giyilebilir Teknoloji > Kulaklıklar > Kulak İçi Kablolu Kulaklık
 * @Category 1778
 * @Field Bağlantı
 */
export const Earphone_Connections = [
  "Bluetooth",
  "Kablolu",
  "USB",
  "Wireless",
] as const;

/**
 * @CategoryName Kulak İçi Kablolu Kulaklık > Elektronik > Giyilebilir Teknoloji > Kulaklıklar > Kulak İçi Kablolu Kulaklık
 * @Category 1778
 * @Field Hoparlör / Kulaklık /Çıkış Fişi
 * @Optional
 */
export const Earphone_Types = ["1", "2", "3", EMPTY_OPTION] as const;

/**
 * @CategoryName Kulak İçi Kablolu Kulaklık > Elektronik > Giyilebilir Teknoloji > Kulaklıklar > Kulak İçi Kablolu Kulaklık
 * @Category 1778
 * @Field Ses Özelliği
 * @Optional
 */
export const Earphone_AudioProp = [
  "5.1 Surround",
  "7.1 Surround",
  "Mono",
  "Stereo",
  EMPTY_OPTION,
] as const;

/**
 * @CategoryName Kulak İçi Kablolu Kulaklık > Elektronik > Giyilebilir Teknoloji > Kulaklıklar > Kulak İçi Kablolu Kulaklık
 * @Category 1778
 * @Field Garanti Tipi
 * @Optional
 */
export const Earphone_GuaranteeTypes = [
  "İthalatçı Garantili",
  "Resmi Distribütör Garantili",
  EMPTY_OPTION,
] as const;

/**
 * @CategoryName Kulak İçi Kablolu Kulaklık > Elektronik > Giyilebilir Teknoloji > Kulaklıklar > Kulak İçi Kablolu Kulaklık
 * @Category 1778
 * @Field Garanti Süresi
 */
export const Earphone_GuaranteePeriods = [
  "2 Yıl",
  "3 Yıl",
  "4 Yıl",
  "5 Yıl",
] as const;
/**
 * @CategoryName Kulak İçi Kablolu Kulaklık > Elektronik > Giyilebilir Teknoloji > Kulaklıklar > Kulak İçi Kablolu Kulaklık
 * @Category 1778
 * @Field Aktif Gürültü Önleme (ANC)
 */
export const Earphone_NoiseCancel = ["Var", "Yok"] as const;
/**
 * @CategoryName Kulak İçi Kablolu Kulaklık > Elektronik > Giyilebilir Teknoloji > Kulaklıklar > Kulak İçi Kablolu Kulaklık
 * @Category 1778
 * @Field Suya/Tere Dayanıklılık
 * @Optional
 */
export const Earphone_Waterproof = ["Var", "Yok", EMPTY_OPTION] as const;
/**
 * @CategoryName Kulak İçi Kablolu Kulaklık > Elektronik > Giyilebilir Teknoloji > Kulaklıklar > Kulak İçi Kablolu Kulaklık
 * @Category 1778
 * @Field Mikrofon
 */
export const Earphone_Microphone = ["Var", "Yok"] as const;
/**
 * @CategoryName Kulak İçi Kablolu Kulaklık > Elektronik > Giyilebilir Teknoloji > Kulaklıklar > Kulak İçi Kablolu Kulaklık
 * @Category 1778
 * @Field Dokunmatik Kontrol
 * @Optional
 */
export const Earphone_TouchControl = ["Var", "Yok", EMPTY_OPTION] as const;
