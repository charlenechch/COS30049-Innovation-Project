import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Image, Dimensions } from 'react-native';

import Footer from '../src/footer';

const { width } = Dimensions.get('window'); 
const OrangUtanImage = require("../assets/orangutan.jpg");

const images = [
  { id: '1', source: require('../assets/image1.jpeg') },
  { id: '2', source: require('../assets/image2.jpeg') },
  { id: '3', source: require('../assets/image3.jpeg') },
  
];

const Homepage = () => {
  const flatListRef = useRef(null); 
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to auto-scroll the FlatList
  const autoScroll = () => {
    if (currentIndex === images.length - 1) {
      setCurrentIndex(0); 
    } else {
      setCurrentIndex((prevIndex) => prevIndex + 1); 
    }
  };

  useEffect(() => {
    // Set interval fcarouor auto-scrolling
    const interval = setInterval(() => {
      autoScroll();
    }, 3000); 

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    // Scroll to the current index when it changes
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: currentIndex, animated: true });
    }
  }, [currentIndex]);

  // Render each item in the FlatList
  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image source={item.source} style={styles.carouselImage} resizeMode="cover" />
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );

  // Render the dots at the bottom to indicate the current slide
  const renderDots = () => {
    return images.map((_, index) => (
      <View
        key={index}
        style={[
          styles.dot,
          index === currentIndex && styles.activeDot,
        ]}
      />
    ));
  };

  return (
    <View style>
      <ScrollView>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        horizontal={true}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        onScrollToIndexFailed={() => {}}
        style={styles.carousel}
      />

      {/* Dots for current slide position */}
      <View style={styles.dotsContainer}>{renderDots()}</View>

      {/* Your other content goes here */}
      <View style={styles.content}>
            <Text style={styles.header}>Introduction</Text>
            <Text style={styles.paragraph}>Established in 1975, the Semenggoh Wildlife Centre cares for wild animals that are injured, orphaned, or previously kept as illegal pets. Located 24 km from Kuching within the Semenggoh Nature Reserve, its main aims are to:</Text>
            <Text style={styles.paragraph}>The Centre has cared for endangered animals from various species, but it is best known for its successful orangutan rehabilitation program. Due to the high number of orangutans reintroduced, the forest’s capacity was reached, shifting rehabilitation activities to the Matang Wildlife Centre.</Text>
            <Text style={styles.paragraph}>Now, Semenggoh focuses on studying orangutan biology and behavior while providing a natural haven for semi-wild orangutans, including those born in the wild to rehabilitated mothers. Visiting Semenggoh offers a unique opportunity to observe these remarkable animals in their natural habitat.</Text>
      </View>

      <View style={styles.content}>
            <Text style={styles.header}>Orang Utan</Text>
            <Image source={OrangUtanImage} style={styles.image}></Image>
            <Text style={styles.paragraph}>The orangutan (pongo pygmaeus), found in the rainforests of Malaysian Borneo (Sarawak and Sabah), Indonesian Borneo (Kalimantan), and North Sumatra, is one of the world’s largest primates and is almost completely arboreal. The word “orang” is Malay for “person” whilst “utan” is derived from “hutan” meaning forest. Thus, orang utan literally translates as “person of the forest”.</Text>
            <Text style={styles.paragraph}>Mature males, with large cheek pads and a throat sac, can reach 150 cm in height, weigh up to 100 kg, and have an arm span of 240 cm. Females are smaller, with both sexes having long reddish hair. Females give birth every 7-8 years and mature at 12, while males mature at 15. Orangutans can live over 50 years in captivity.</Text>
            <Text style={styles.paragraph}>Primarily fruit eaters, they also consume leaves, insects, bark, flowers, eggs, and small lizards, building new nests each night in the forest canopy. They are generally solitary due to food scarcity and lack of predators.</Text>
            <Text style={styles.paragraph}>With an estimated 20-27,000 left in the wild, orangutans are endangered due to deforestation, habitat encroachment, hunting, and the live animal trade. Rehabilitation programs in Indonesia and Malaysia, like Sarawak’s Semenggoh Centre, work to reintroduce rescued orangutans and educate the public.</Text>
      </View>

      <View style={styles.content}>
            <Text style={styles.header}>Visiting Hour</Text>
            <Text>8:00a.m -10: 00a.m,  2:00p.m – 4:00p.m (Monday to Sunday)</Text>
      </View>

      <View style={styles.content}>
            <Text style={styles.header}>Feeding Time</Text>
            <Text>9:00a.m-10: 00a.m, 3:00p.m – 4:00p.m.</Text>
      </View>

      <View style={styles.content}>
            <Text style={styles.header}>Contact</Text>
            <Text>082-618 325 / 082-618 324 (Semenggoh Wildlife Centre)</Text>
      </View>

      <Footer/>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingTop: 0, 
  },
  
  carousel: {
    width: '100%', 
    height: 200,
    marginBottom: 0, 
  },

  slide: {
    width: width, 
  },

  carouselImage: {
    width: width, 
    height: 200, 
  },

  image: {
    marginVertical: 10, 
    width: '100%'
  },

  title: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 25
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'gray',
    margin: 5,
  },

  activeDot: {
    backgroundColor: 'white',
  },

  content: {
    paddingHorizontal: 20, 
    marginTop: 30,
  },

  paragraph: {
    marginTop: 20,
  },

  header:{
    fontWeight: 'bold',
    fontSize: 20,
  }
});

export default Homepage;
