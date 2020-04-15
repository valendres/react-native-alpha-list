import React from "react";
import {
  View,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
  SectionListProps,
  GestureResponderEvent,
} from "react-native";
import { styles } from "./AlphaListNav.styles";
import type { AlphaListSection } from "./AlphaList";

const returnTrue = () => true;

export interface AlphaListNavProps {
  NavItem: React.ComponentType<{ sectionKey: string; title: string }>;

  getNavItemTitle?: (sectionKey: string) => string;

  onNavItemSelect?: (sectionKey: string) => void;

  data: SectionListProps<any>["data"];

  sections: AlphaListSection[];

  style: StyleProp<ViewStyle>;

  textStyle: StyleProp<TextStyle>;
}

export class AlphaListNav extends React.Component<AlphaListNavProps> {
  private lastSelectedIndex: number = null;
  private measureTimer: number;
  private measure: {
    y: number;
    width: number;
    height: number;
  };

  constructor(props: AlphaListNavProps) {
    super(props);
    this.handleNavItemSelect = this.handleNavItemSelect.bind(this);
    this.detectAndScrollToSection = this.detectAndScrollToSection.bind(this);
    this.resetSection = this.resetSection.bind(this);
    this.fixSectionItemMeasure = this.fixSectionItemMeasure.bind(this);
  }

  componentDidMount() {
    this.fixSectionItemMeasure();
  }

  componentDidUpdate() {
    this.fixSectionItemMeasure();
  }

  componentWillUnmount() {
    this.measureTimer && clearTimeout(this.measureTimer);
  }

  render() {
    const { NavItem, data, getNavItemTitle, style, textStyle } = this.props;
    const sections = Object.keys(data).map((sectionKey, index) => {
      const title = getNavItemTitle?.(sectionKey) || sectionKey;
      const child = NavItem ? (
        <NavItem sectionKey={sectionKey} title={title} />
      ) : (
        <View>
          <Text
            style={[
              data[sectionKey].length ? styles.text : styles.textInactive,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      );

      return (
        <View
          key={index}
          ref={"sectionItem" + index}
          style={styles.item}
          pointerEvents="none"
        >
          {child}
        </View>
      );
    });

    return (
      <View
        ref="view"
        style={[styles.container, style]}
        onStartShouldSetResponder={returnTrue}
        onMoveShouldSetResponder={returnTrue}
        onResponderGrant={this.detectAndScrollToSection}
        onResponderMove={this.detectAndScrollToSection}
        onResponderRelease={this.resetSection}
      >
        {sections}
      </View>
    );
  }

  handleNavItemSelect(sectionKey: string, fromTouch: boolean) {
    const { onNavItemSelect } = this.props;

    onNavItemSelect?.(sectionKey);

    if (!fromTouch) {
      this.lastSelectedIndex = null;
    }
  }

  detectAndScrollToSection(event: GestureResponderEvent) {
    const { data, sections } = this.props;
    const targetY = (event.nativeEvent.touches[0] || event.nativeEvent).pageY;
    const { y, height } = this.measure;
    if (!y || targetY < y) {
      return;
    }
    const index = Math.min(
      Math.floor((targetY - y) / height),
      sections.length - 1
    );
    if (
      this.lastSelectedIndex !== index &&
      data[sections[index].sectionKey].length
    ) {
      this.lastSelectedIndex = index;
      this.handleNavItemSelect(sections[index].sectionKey, true);
    }
  }

  resetSection() {
    this.lastSelectedIndex = null;
  }

  fixSectionItemMeasure() {
    const sectionItem = this.refs.sectionItem0;
    if (!sectionItem) {
      return;
    }
    this.measureTimer = setTimeout(() => {
      (sectionItem as any).measure(
        (
          x: number,
          y: number,
          width: number,
          height: number,
          pageX: number,
          pageY: number
        ) => {
          this.measure = {
            y: pageY,
            width,
            height,
          };
        }
      );
    }, 0);
  }
}
