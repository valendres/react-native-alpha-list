import React from "react";
import {
  SectionList,
  View,
  Text,
  StyleProp,
  ViewStyle,
  SectionListProps,
} from "react-native";
import sectionListGetItemLayout from "react-native-section-list-get-item-layout";

import { AlphaListNav, AlphaListNavProps } from "./AlphaListNav";
import { styles } from "./AlphaList.styles";

export interface AlphaListSection {
  sectionKey: string;
  data: AlphaListProps<any>["data"][0];
}

export interface AlphaListProps<Item>
  extends Omit<SectionListProps<Item>, "sections" | "data"> {
  config: {
    itemHeight: number;
    sectionHeaderHeight?: number;
    sectionFooterHeight?: number;
    separatorHeight?: number;
  };

  data: {
    [sectionKey: string]: any[];
  };

  /**
   * Whether to show the section listing or not
   */
  hideNav?: boolean;

  /**
   * Functions to provide a title for the section header and the section list
   * items. If not provided, the section ids will be used (the keys from the data object)
   */
  getNavItemTitle?: AlphaListNavProps["getNavItemTitle"];

  /**
   * A custom element to render for right each section list item
   */
  NavItem?: AlphaListNavProps["NavItem"];

  /**
   * Callback which should be called when the user scrolls to a section
   */
  onScrollToSection?: (sectionKey: string) => void;

  /**
   * rightSection style
   */
  navItemStyle?: AlphaListNavProps["style"];

  /**
   * Right section font style
   */
  navItemTextStyle?: AlphaListNavProps["textStyle"];

  /**
   * Default section header style
   */
  sectionHeaderStyle?: StyleProp<ViewStyle>;

  /**
   * Default section header text style
   */
  sectionHeaderTextStyle?: StyleProp<ViewStyle>;
}

export class AlphaList<Item> extends React.Component<AlphaListProps<Item>> {
  private containerRef = React.createRef<View>();
  private sectionListRef = React.createRef<SectionList>();
  private getItemLayout: any;

  constructor(props: AlphaListProps<Item>) {
    super(props);

    this.getItemLayout = sectionListGetItemLayout({
      // The height of the row with rowData at the given sectionIndex and rowIndex
      getItemHeight: (rowData, sectionIndex, rowIndex) => {
        return sectionIndex === 0 ? this.props.config?.itemHeight : 55.7;
      },

      // These three properties are optional
      getSectionHeaderHeight: () =>
        this.props.config?.sectionHeaderHeight ?? 10, // The height of your section headers
      // getSeparatorHeight: () => 1 / PixelRatio.get(), // The height of your separators
      // getSectionFooterHeight: () => 10, // The height of your section footers
    });

    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this.handleSectionSelect = this.handleSectionSelect.bind(this);
  }

  // componentDidMount() {
  //   setTimeout(() => {
  //     NativeModules.UIManager.measure(
  //       findNodeHandle(this.containerRef.current),
  //       (x: number, y: number, width: number, height: number) => {
  //         if (
  //           this.props.contentInset &&
  //           this.props.data &&
  //           this.props.data.length > 0
  //         ) {
  //           this.handleSectionSelect(Object.keys(this.props.data)[0]);
  //         }
  //       }
  //     );
  //   }, 0);
  // }

  renderSectionHeader({ section }: { section: AlphaListSection }) {
    const { sectionHeaderStyle, sectionHeaderTextStyle } = this.props;
    return (
      <View style={[styles.sectionHeader, sectionHeaderStyle]}>
        <Text style={sectionHeaderTextStyle}>{section?.sectionKey}</Text>
      </View>
    );
  }

  render() {
    const {
      data,
      style,
      hideNav,
      getNavItemTitle,
      NavItem,
      onScrollToSection,
      navItemStyle,
      navItemTextStyle,
      sectionHeaderStyle,
      sectionHeaderTextStyle,
      ...restProps
    } = this.props;

    const injectedProps: any = {
      getItemLayout: this.getItemLayout,
    };

    const sectionKeys = Object.keys(data);
    const sections: AlphaListSection[] = sectionKeys.map((sectionKey) => ({
      sectionKey,
      data: data[sectionKey],
    }));

    return (
      <View ref={this.containerRef} style={[styles.container, style]}>
        <SectionList
          renderSectionHeader={this.renderSectionHeader}
          keyExtractor={(item, index) => item + index}
          {...restProps}
          {...injectedProps}
          ref={this.sectionListRef}
          data={data}
          sections={sections}
        />
        {!hideNav && (
          <AlphaListNav
            style={navItemStyle}
            textStyle={navItemTextStyle}
            onNavItemSelect={this.handleSectionSelect}
            getNavItemTitle={getNavItemTitle}
            sections={sections}
            data={data}
            NavItem={NavItem}
          />
        )}
      </View>
    );
  }

  handleSectionSelect(sectionKey: string) {
    const { data, onScrollToSection } = this.props;

    const sectionIndex = Object.keys(data).indexOf(sectionKey);
    this.sectionListRef.current.scrollToLocation({
      sectionIndex,
      itemIndex: 0,
      animated: true,
    });

    onScrollToSection?.(sectionKey);
  }
}
