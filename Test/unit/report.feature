Feature: Source map support
  As a developer
  I can run Istanbul code coverage on script bundles and have code coverage reported against the original source code
  So that I can use script bundles and code coverage that reports against my original source for more efficient and accurate code coverage reporting

  Scenario: Code coverage report with no source maps

    Given I have non-bundled Javascript files
    When I run coverage report on the files
    Then a coverage report is produced referencing the non-bundled files

  Scenario: Code coverage report with source maps

    Given I have a bundled Javascript file
    When I run coverage report on the file
    Then a coverage report is produced referencing the non-bundled files
