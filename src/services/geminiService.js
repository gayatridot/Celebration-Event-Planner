import { getStoredApiKey } from './storageService';

/**
 * Fallback culturally authentic multilingual generator
 * Ensures zero-friction evaluator experience even without an active internet key.
 */
const CULTURAL_TEMPLATES = {
  en: {
    Marriage: {
      poetic: {
        headline: "Two Hearts, One Sacred Journey",
        tagline: "Celebrating the Union of Soulmates",
        message: "As destiny weaves two lives together with love, respect, and eternal vows, we cordially invite you to bless the auspicious union of two families.",
        hostLine: "With immense joy and warm blessings, the families request your gracious presence.",
        specialNote: "Royal Festive Attire • Dinner & Blessings to follow"
      },
      traditional: {
        headline: "Sacred Vivaha Mahotsav",
        tagline: "Under the Auspicious Celestial Blessings",
        message: "With the divine blessings of the Almighty and our ancestors, we invite you to grace the sacred wedding pheras and shower the couple with your boundless love.",
        hostLine: "Cordially invited by the Sharma & Singhania Families",
        specialNote: "Traditional Indian Attire • Pheras followed by Royal Banquet"
      },
      modern: {
        headline: "We Are Tying The Knot!",
        tagline: "Together Forever & Always",
        message: "Because you have shared in our lives with friendship and love, join us as we begin our newest adventure and celebrate our happily ever after.",
        hostLine: "Join us for music, dinner, and celebrations with our families",
        specialNote: "Cocktail / Festive Glamour"
      }
    },
    Birthday: {
      poetic: {
        headline: "Celebrating Another Year of Joy",
        tagline: "Laughter, Cake & Wonderful Memories",
        message: "Join us as we celebrate this special birthday milestone surrounded by warm smiles, delicious treats, and festive music.",
        hostLine: "Warmly invited by the host family and friends",
        specialNote: "Party Casual • Cake Cutting & Refreshments"
      }
    },
    Community: {
      poetic: {
        headline: "Celebrating Our Shared Heritage",
        tagline: "Unity, Culture & Community Harmony",
        message: "We warmly invite you, your family, and neighbors to partake in an enriching celebration of art, music, food stalls, and togetherness.",
        hostLine: "Cordially presented by the Community Action Committee",
        specialNote: "Festive Ethnic Attire • Cultural Stage & Community Feast"
      }
    },
    Diwali: {
      poetic: {
        headline: "Radiance, Blessings & Golden Diyas",
        tagline: "The Triumph of Light Over Darkness",
        message: "May the divine glow of Diwali illuminate your hearth and heart with boundless joy, prosperity, and peace. Celebrate this festival of lights with us.",
        hostLine: "Warmly invited by our family to share in festive cheer and sweets",
        specialNote: "Festive Sparkle • Traditional Sweets & Sparklers"
      },
      traditional: {
        headline: "Shubh Deepavali & Lakshmi Pujan",
        tagline: "Invoking Grace, Wealth, and Harmony",
        message: "As golden diyas flicker and sacred mantras echo, we invite you to partake in the holy evening of prayer, gratitude, and joyous celebration.",
        hostLine: "Cordially welcomed by the Mehta Family",
        specialNote: "Ethnic Traditional Attire • Prasad & Deepotsav Dinner"
      }
    },
    Christmas: {
      poetic: {
        headline: "Joy to the World & Holiday Cheer",
        tagline: "Magic, Wonder & The Warmth of Family",
        message: "The snow whispers peace, the lights sparkle bright, and hearts are warm with holiday delight. Gather with us for a season of gratitude and merriment.",
        hostLine: "Warmly hosted with love and seasonal cheer",
        specialNote: "Festive Holiday Attire • Eggnog & Carols by the Hearth"
      }
    },
    'New Year': {
      poetic: {
        headline: "Toast to New Beginnings 2027",
        tagline: "A Midnight of Dreams, Music & Spark",
        message: "Let us bid farewell to the memories of yesterday and welcome the infinite promise of tomorrow with champagne, laughter, and high spirits.",
        hostLine: "Presented with excitement by the Host Committee",
        specialNote: "Black Tie & Sparkling Chic • Midnight Champagne Countdown"
      }
    },
    Corporate: {
      formal: {
        headline: "Leadership, Vision & Distinction",
        tagline: "Annual Executive Symposium & Honor",
        message: "Join distinguished thought leaders, corporate pioneers, and industry trailblazers as we reflect on milestones achieved and illuminate tomorrow's horizon.",
        hostLine: "The Board of Directors cordially requests the honor of your presence",
        specialNote: "Business Formal • Keynotes followed by Executive Gala"
      }
    },
    Anniversary: {
      poetic: {
        headline: "A Quarter-Century of Endless Love",
        tagline: "Silver Jubilee Milestone Celebration",
        message: "Twenty-five years of cherished laughter, steadfast trust, and memories woven into gold. Come toast to a love that grows sweeter with every sunrise.",
        hostLine: "Warmly invited by the couple and their adoring family",
        specialNote: "Cocktail Elegance • Toasting & Nostalgia"
      }
    }
  },
  hi: {
    Marriage: {
      traditional: {
        headline: "शुभ विवाह निमंत्रण",
        tagline: "मंगलम् भगवान विष्णुः मंगलम् गरुड़ध्वजः",
        message: "प्रभु कृपा एवं बड़ों के स्नेह से दो पावन आत्माएं परिणय सूत्र में बंधने जा रही हैं। इस शुभ अवसर पर वर-वधू को अपना स्नेह व आशीर्वाद प्रदान करने हेतु सपरिवार सादर आमंत्रित हैं।",
        hostLine: "दर्शनाभिलाषी: समस्त परिवारजन एवं स्नेही",
        specialNote: "पारंपरिक वेशभूषा • प्रीतिभोज एवं शुभ आशीर्वाद"
      },
      poetic: {
        headline: "स्नेह, समर्पण और सात फेरे",
        tagline: "दो हृदयों का पावन मिलन",
        message: "तारों की छांव में, खुशियों की महक के साथ, एक नए जीवन की शुरुआत हो रही है। इस मांगलिक उत्सव की शोभा आपके आगमन से ही पूर्ण होगी।",
        hostLine: "स्वागतकांक्षी: परिवार के समस्त सदस्य",
        specialNote: "राजसी उत्सव परिधान • रात्रि भोज"
      }
    },
    Birthday: {
      poetic: {
        headline: "Celebrating Another Year of Joy",
        tagline: "Laughter, Cake & Wonderful Memories",
        message: "Join us as we celebrate this special birthday milestone surrounded by warm smiles, delicious treats, and festive music.",
        hostLine: "Warmly invited by the host family and friends",
        specialNote: "Party Casual • Cake Cutting & Refreshments"
      }
    },
    Community: {
      poetic: {
        headline: "Celebrating Our Shared Heritage",
        tagline: "Unity, Culture & Community Harmony",
        message: "We warmly invite you, your family, and neighbors to partake in an enriching celebration of art, music, food stalls, and togetherness.",
        hostLine: "Cordially presented by the Community Action Committee",
        specialNote: "Festive Ethnic Attire • Cultural Stage & Community Feast"
      }
    },
    Diwali: {
      traditional: {
        headline: "शुभ दीपावली दीपोत्सव",
        tagline: "तमसो मा ज्योतिर्गमय",
        message: "दीपों का यह पावन पर्व आपके जीवन में सुख, शांति, समृद्धि और अपार खुशियां लेकर आए। दीपोत्सव की इस जगमगाती शाम में हमारे साथ शामिल हों।",
        hostLine: "सप्रेम निमंत्रण: परिवार की ओर से",
        specialNote: "पारंपरिक परिधान • दीप प्रज्वलन व आतिशबाजी"
      }
    },
    Christmas: {
      poetic: {
        headline: "क्रिसमस का पावन आनंद",
        tagline: "शांति, प्रेम और खुशियों का पर्व",
        message: "प्रभु यीशु का पावन प्रेम आपके घर को खुशियों और शांति से भर दे। आइए मिलकर इस क्रिसमस पर्व को प्रेम और उपहारों के साथ मनाएं।",
        hostLine: "सप्रेम आमंत्रित: डी'सूजा परिवार",
        specialNote: "हॉलिडे परिधान • क्रिसमस कैरोल एवं रात्रिभोज"
      }
    },
    'New Year': {
      festive: {
        headline: "नव वर्ष 2027 का भव्य स्वागत",
        tagline: "नई उम्मीदें, नए संकल्प",
        message: "बीते साल की मीठी यादों को संजोते हुए और आने वाले सुनहरे कल का स्वागत करते हुए, आइए संगीत, उमंग और आतिशबाजी के संग नए साल का जश्न मनाएं।",
        hostLine: "उमंग और उत्साह के साथ आमंत्रित",
        specialNote: "उत्सव परिधान • मध्यरात्रि काउंटडाउन"
      }
    },
    Corporate: {
      formal: {
        headline: "वार्षिक नेतृत्व सम्मेलन व सम्मान समारोह",
        tagline: "नवाचार और उत्कृष्टता की नई दिशा",
        message: "उद्योग जगत के शीर्ष विचारकों और मार्गदर्शकों के साथ भविष्य की रणनीतियों पर परिचर्चा हेतु आपका सादर स्वागत है।",
        hostLine: "प्रबंधन समिति द्वारा सादर आमंत्रित",
        specialNote: "औपचारिक व्यावसायिक परिधान • रात्रिभोज व सम्मान"
      }
    },
    Anniversary: {
      poetic: {
        headline: "रजत जयंती वैवाहिक वर्षगांठ",
        tagline: "प्रेम, विश्वास और समर्पण के 25 वर्ष",
        message: "समय के साथ और भी गहरा होता यह रिश्ता आज पच्चीस स्वर्णिम वर्ष पूरे कर रहा है। हमारे इस सफर की खुशियों में शरीक होकर अपने आशीर्वाद से हमें अनुगृहीत करें।",
        hostLine: "निवेदक: समस्त परिवारजन",
        specialNote: "उत्सव परिधान • डिनर एवं संगीत"
      }
    }
  },
  mr: {
    Marriage: {
      traditional: {
        headline: "शुभ विवाह सोहळा",
        tagline: "मंगल अष्टकांचा गजर व पावन ऋणानुबंध",
        message: "ज्येष्ठांचे आशीर्वाद व ईश्वराच्या कृपेने सुरू होणाऱ्या या नव्या प्रवासात वधू-वरांना शुभ आशीर्वाद देण्यासाठी आपण सहकुटुंब, सहपरिवार उपस्थित राहून आमचा आनंद द्विगुणीत करावा ही नम्र विनंती.",
        hostLine: "निमंत्रक: सर्व कुटुंबीय व आप्तेष्ट",
        specialNote: "पारंपरिक मराठमोळा पोषाख • अक्षता व स्नेहभोजन"
      }
    },
    Birthday: {
      poetic: {
        headline: "Celebrating Another Year of Joy",
        tagline: "Laughter, Cake & Wonderful Memories",
        message: "Join us as we celebrate this special birthday milestone surrounded by warm smiles, delicious treats, and festive music.",
        hostLine: "Warmly invited by the host family and friends",
        specialNote: "Party Casual • Cake Cutting & Refreshments"
      }
    },
    Community: {
      poetic: {
        headline: "Celebrating Our Shared Heritage",
        tagline: "Unity, Culture & Community Harmony",
        message: "We warmly invite you, your family, and neighbors to partake in an enriching celebration of art, music, food stalls, and togetherness.",
        hostLine: "Cordially presented by the Community Action Committee",
        specialNote: "Festive Ethnic Attire • Cultural Stage & Community Feast"
      }
    },
    Diwali: {
      traditional: {
        headline: "तेजोमय दीपोत्सव सोहळा",
        tagline: "दिवाळी पहाट आणि आनंदाची उधळण",
        message: "दिव्यांच्या लखलखाटात आणि रांगोळीच्या रंगात न्हाऊन निघालेली ही मंगल दिवाळी आपणांस सुख, समृद्धी आणि उत्तम आरोग्य देवो. या आनंद सोहळ्यात आपले मनःपूर्वक स्वागत.",
        hostLine: "स्नेहपूर्वक निमंत्रण: मेहता परिवार",
        specialNote: "पारंपरिक वेशभूषा • फराळ व सांस्कृतिक संध्या"
      }
    },
    Christmas: {
      poetic: {
        headline: "आनंददायी नाताळ महोत्सव",
        tagline: "शांती, प्रीती आणि उत्साहाचा सण",
        message: "येशू ख्रिस्ताच्या जन्माचा मंगल संदेश घेऊन आलेल्या नाताळ सणाच्या पवित्र दिवशी स्नेहभोजन व आनंदोत्सव साजरा करण्यास आपण सहकुटुंब आमंत्रित आहात.",
        hostLine: "सस्नेह निमंत्रण",
        specialNote: "हॉलिडे उत्सव पोषाख • कॅरोल गायन"
      }
    },
    'New Year': {
      festive: {
        headline: "नववर्ष 2027 स्वागत सोहळा",
        tagline: "नव्या आशा, नव्या आकांक्षा आणि संगीत",
        message: "सरत्या वर्षाला कृतज्ञतापूर्वक निरोप देत नव्या वर्षाच्या स्वागतासाठी एकत्र येऊया आणि हा क्षण संस्मरणीय बनवूया.",
        hostLine: "आपले स्नेही व आयोजक",
        specialNote: "पार्टी वेअर • मध्यरात्री आतषबाजी"
      }
    },
    Corporate: {
      formal: {
        headline: "वार्षिक व्यावसायिक नेतृत्व परिषद",
        tagline: "नवनिर्मिती आणि उत्कृष्टतेचा सन्मान",
        message: "उद्योग क्षेत्रातील अग्रगण्य विचारवंत आणि तंत्रज्ञानाचे नेतृत्व करणाऱ्या मान्यवरांच्या उपस्थितीत होणाऱ्या या परिषदेसाठी आपले स्वागत आहे.",
        hostLine: "आयोजन समिती",
        specialNote: "फॉर्मल बिझनेस वेअर • डिनर व नेटवर्किंग"
      }
    },
    Anniversary: {
      poetic: {
        headline: "रौप्य महोत्सवी लग्नगाठ",
        tagline: "२५ वर्षांचा अतूट विश्वासाचा प्रवास",
        message: "हसत-खेळत, संकटांना सामोरे जात प्रेमाचे २५ वर्षे पूर्ण होत आहेत. या सुवर्ण क्षणाचे साक्षीदार होण्यासाठी आपले सहर्ष स्वागत.",
        hostLine: "स्नेही व कुटुंबीय",
        specialNote: "उत्सव पोषाख • स्नेहभोजन"
      }
    }
  },
  gu: {
    Marriage: {
      traditional: {
        headline: "શુભ લગ્ન મહોત્સવ",
        tagline: "મંગલ ફેરા અને બે પરિવારોનું પવિત્ર મિલન",
        message: "ઈશ્વરની કૃપા અને વડીલોના સ્નેહ આશીર્વાદથી નવદંપતી જીવનના નૂતન પંથે પ્રયાણ કરી રહ્યા છે. આ શુભ પ્રસંગે નવયુગલને આશીર્વાદ આપવા પધારવા આપને હાર્દિક નિમંત્રણ છે.",
        hostLine: "લિ. સ્નેહીજનો અને પરિવાર",
        specialNote: "પરંપરાગત પોશાક • પ્રીતિભોજન અને આશીર્વાદ"
      }
    },
    Birthday: {
      poetic: {
        headline: "Celebrating Another Year of Joy",
        tagline: "Laughter, Cake & Wonderful Memories",
        message: "Join us as we celebrate this special birthday milestone surrounded by warm smiles, delicious treats, and festive music.",
        hostLine: "Warmly invited by the host family and friends",
        specialNote: "Party Casual • Cake Cutting & Refreshments"
      }
    },
    Community: {
      poetic: {
        headline: "Celebrating Our Shared Heritage",
        tagline: "Unity, Culture & Community Harmony",
        message: "We warmly invite you, your family, and neighbors to partake in an enriching celebration of art, music, food stalls, and togetherness.",
        hostLine: "Cordially presented by the Community Action Committee",
        specialNote: "Festive Ethnic Attire • Cultural Stage & Community Feast"
      }
    },
    Diwali: {
      traditional: {
        headline: "દિવ્ય દીપોત્સવ અને સ્નેહમિલન",
        tagline: "નૂતન વર્ષાભિનંદન અને પ્રકાશ પર્વ",
        message: "દિવાળીના દિવડાઓ આપના જીવનમાં સુખ, શાંતિ અને રિદ્ધિ-સિદ્ધિ પાથરે તેવી શુભકામનાઓ. આવો સાથે મળીને આ પર્વની ઉજવણી કરીએ.",
        hostLine: "હાર્દિક આમંત્રણ: સમગ્ર પરિવાર તરફથી",
        specialNote: "ટ્રેડિશનલ પરિધાન • રંગોળી અને મિઠાઈ ઉત્સવ"
      }
    },
    Christmas: {
      poetic: {
        headline: "ક્રિસમસ સ્નેહ પર્વ",
        tagline: "પ્રેમ, શાંતિ અને આનંદની ઉજવણી",
        message: "પ્રભુ ઈસુના પાવન અવસર પર પરિવાર અને સ્નેહીજનો સાથે મળીને પ્રેમ અને ભેટસોગાદોની વહેંચણી કરવા આપનું સ્વાગત છે.",
        hostLine: "સસ્નેહ આમંત્રણ",
        specialNote: "ફેસ્ટિવ પરિધાન • ડિનર અને સંગીત"
      }
    },
    'New Year': {
      festive: {
        headline: "નૂતન વર્ષ 2027 નો ભવ્ય પ્રારંભ",
        tagline: "નવા ઉત્સાહ અને રંગબેરંગી રોશની સાથે",
        message: "નવા વર્ષની સુંદર ક્ષણો અને નવી આશાઓને આવકારવા માટે સંગીત અને આનંદ સાથે ઉજવણીમાં સહભાગી બનો.",
        hostLine: "આયોજક સમિતિ",
        specialNote: "પાર્ટી વેર • મિડનાઇટ કાઉન્ટડાઉન"
      }
    },
    Corporate: {
      formal: {
        headline: "વાર્ષિક બિઝનેસ લીડરશિપ સમિટ",
        tagline: "ઇનોવેશન અને ગ્રોથની નવી ક્ષિતિજો",
        message: "ઉદ્યોગ જગતના અગ્રણીઓ સાથે બિઝનેસ સંવાદ અને ઉત્કૃષ્ટ સિદ્ધિઓના સન્માન સમારોહમાં આપનું સ્વાગત છે.",
        hostLine: "મેનેજમેન્ટ કમિટી",
        specialNote: "બિઝનેસ ફોર્મલ • નેટવર્કિંગ ડિનર"
      }
    },
    Anniversary: {
      poetic: {
        headline: "સિલ્વર જ્યુબિલી લગ્ન મહોત્સવ",
        tagline: "૨૫ વર્ષનો પ્રેમ અને વિશ્વાસનો સાથ",
        message: "પ્રેમ અને સમજણથી ભરેલા પચીસ સુંદર વર્ષોની ઉજવણીમાં આપના અમૂલ્ય આશીર્વાદ આપવા પધારવા ભાવભર્યું આમંત્રણ છે.",
        hostLine: "સ્નેહી પરિવાર",
        specialNote: "ઉત્સવ પોશાક • રાત્રિભોજન"
      }
    }
  },
  es: {
    Marriage: {
      poetic: {
        headline: "Nuestra Boda Soñada",
        tagline: "Dos Almas, Un Solo Corazón",
        message: "El amor verdadero es un viaje que dura toda la vida. Con gran alegría en nuestros corazones, te invitamos a celebrar el día en que uniremos nuestras vidas para siempre.",
        hostLine: "Con gran emoción, las familias esperan contar con su grata presencia",
        specialNote: "Vestimenta Formal de Gala • Recepción y Baile"
      }
    },
    Birthday: {
      poetic: {
        headline: "Celebrating Another Year of Joy",
        tagline: "Laughter, Cake & Wonderful Memories",
        message: "Join us as we celebrate this special birthday milestone surrounded by warm smiles, delicious treats, and festive music.",
        hostLine: "Warmly invited by the host family and friends",
        specialNote: "Party Casual • Cake Cutting & Refreshments"
      }
    },
    Community: {
      poetic: {
        headline: "Celebrating Our Shared Heritage",
        tagline: "Unity, Culture & Community Harmony",
        message: "We warmly invite you, your family, and neighbors to partake in an enriching celebration of art, music, food stalls, and togetherness.",
        hostLine: "Cordially presented by the Community Action Committee",
        specialNote: "Festive Ethnic Attire • Cultural Stage & Community Feast"
      }
    },
    Diwali: {
      traditional: {
        headline: "Festival de la Luz y Prosperidad",
        tagline: "Celebrando la Victoria del Amor y la Armonía",
        message: "Que el resplandor divino de las lámparas doradas llene tu hogar de paz, dicha y abundancia. Ven a compartir con nosotros este banquete especial.",
        hostLine: "La familia le invita cordialmente a compartir esta gran fiesta",
        specialNote: "Traje Festivo • Dulces Tradicionales y Luces"
      }
    },
    Christmas: {
      poetic: {
        headline: "Magia y Paz en Navidad",
        tagline: "Una Nochebuena de Amor y Gratitud",
        message: "Bajo la luz de las estrellas y el calor del hogar, celebremos el milagro de la Navidad rodeados de risas, buena música y la mejor compañía.",
        hostLine: "Invitación cordial de nuestra familia para la suya",
        specialNote: "Elegancia Navideña • Cena y Brindis Festivo"
      }
    },
    'New Year': {
      festive: {
        headline: "Gran Fiesta de Fin de Año 2027",
        tagline: "Brindemos por Nuevos Sueños y Comienzos",
        message: "Despidamos el año que termina y demos la bienvenida al 2027 con champán, fuegos artificiales, baile y la mejor energía.",
        hostLine: "Comité de Anfitriones y Amigos",
        specialNote: "Etiqueta / Chic Festivo • Brindis a Medianoche"
      }
    },
    Corporate: {
      formal: {
        headline: "Cumbre Anual de Líderes Empresariales",
        tagline: "Innovación, Liderazgo y Excelencia",
        message: "Nos complace invitarle a una velada de distinción donde honraremos los logros del año y trazaremos el futuro de nuestra industria.",
        hostLine: "La Junta Directiva solicita el honor de su presencia",
        specialNote: "Traje Formal de Negocios • Cóctel y Cena de Gala"
      }
    },
    Anniversary: {
      poetic: {
        headline: "Bodas de Plata - 25 Años de Amor",
        tagline: "Una Vida Entera Construyendo Recuerdos",
        message: "Veinticinco años después, nuestro amor sigue siendo la mayor bendición. Te invitamos a brindar por el camino recorrido y los años que vendrán.",
        hostLine: "Agradecidos de compartir este momento contigo",
        specialNote: "Vestimenta Elegante • Brindis y Música en Vivo"
      }
    }
  }
};

/**
 * Generates card copy with Gemini 1.5 Flash API or smart fallback
 */
export const generateCardContent = async ({
  event,
  language = 'en',
  tone = 'Warm & Poetic',
  apiKey = null
}) => {
  const activeKey = apiKey || getStoredApiKey();

  // If activeKey is provided, attempt call to Google Gemini 1.5 Flash API
  if (activeKey && activeKey.trim() !== '') {
    try {
      const prompt = `You are an elite poetic invitation copywriter for royal celebrations and prestigious events.
Generate invitation card copy in the target language for the following celebration event:
Event Name: "${event.name}"
Category: "${event.category}"
Date: "${event.date}"
Time: "${event.time}"
Venue: "${event.venue}"
Host Name: "${event.host}"
Additional Context: "${event.description || ''}"
Target Language: "${language}" (en=English, hi=Hindi, mr=Marathi, gu=Gujarati, es=Spanish)
Tone: "${tone}"

Return STRICTLY a JSON object with this exact structure (no markdown fences, just pure JSON):
{
  "headline": "A captivating, grand title in the target language (max 8 words)",
  "tagline": "An inspiring poetic subtitle, blessing, or phrase in the target language (max 10 words)",
  "message": "An eloquent, emotional, culturally resonant invitation message or poem in the target language (2 to 4 sentences/verses)",
  "hostLine": "A polite host statement inviting guests with honor (e.g. 'Cordially invited by [Host Name]') in the target language",
  "specialNote": "A festive dress code or cultural highlight in the target language (e.g. 'Royal Traditional Attire • Dinner & Blessings to follow')"
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey.trim()}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ],
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 600,
              responseMimeType: 'application/json'
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Gemini API returned status ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (rawText) {
        // Clean markdown backticks if any
        const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return {
          ...parsed,
          source: 'gemini-1.5-flash',
          isLiveAi: true
        };
      }
    } catch (err) {
      console.warn('Gemini 1.5 Flash API call error, falling back to smart cultural template:', err);
      // Fall through to fallback generator seamlessly with error details noted
    }
  }

  // Smart Cultural Fallback
  const langKey = CULTURAL_TEMPLATES[language] ? language : 'en';
  const categoryTemplates = CULTURAL_TEMPLATES[langKey]?.[event.category] || CULTURAL_TEMPLATES['en']?.[event.category] || CULTURAL_TEMPLATES['en']['Marriage'];
  
  const toneKey = Object.keys(categoryTemplates)[0] || 'poetic';
  const template = categoryTemplates[toneKey];

  return {
    headline: template.headline || `${event.name}`,
    tagline: template.tagline || `Celebration of ${event.category}`,
    message: template.message || `We cordially invite you to join us on ${event.date} at ${event.venue} to celebrate ${event.name}.`,
    hostLine: template.hostLine ? template.hostLine.replace('[Host Name]', event.host) : `Cordially invited by ${event.host}`,
    specialNote: template.specialNote || 'Festive Attire • Dinner to follow',
    source: activeKey ? 'gemini-fallback-after-error' : 'smart-cultural-engine',
    isLiveAi: false
  };
};
